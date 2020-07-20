import { BaseController } from '@base/Controller/index.controller';
import { Get, ParseIntPipe, Param, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { getDeepFieldsFromCollection, getValueOfKeyFromCollection, createSlug, createSlugWithDateTime } from '@core/utils/helper';
import { TreeBaseRepository } from '@treebase/Repository/index.repository';
import _ from 'lodash';
import { Name } from '@common/decorators/crudName.decorator';
import { CrudName } from '@common/enums/crudName.enum';
import { ParsedRequest, CrudRequest, ParsedBody, CreateManyDto } from '@nestjsx/crud';
import { CurrentUser } from '@common/decorators/currentUser.decorator';
import { extractExistedKey } from '@core/utils/appHelper';

export class TreeBaseController<T> extends BaseController<T> {
  constructor(protected readonly baseRepository: TreeBaseRepository<T>) {
    super(baseRepository);
  }

  async saveObject(paramObject: any, dto: any) {
    try {
      let dbObject: any = {};
      if (_.isEmpty(paramObject)) {
        // CREATE
        dbObject = dto;
        if(!dto.slug) {
          if (_.has(dto, 'title')) dbObject.slug = createSlugWithDateTime(dto.title);
          if (_.has(dto, 'name')) dbObject.slug = createSlug(dto.name);
        }
      }
      else {
        // UPDATE
        const paramName = paramObject.title || paramObject.name;
        const paramSlug = paramObject.slug;
        const dtoName = dto.title || dto.name;
        dbObject = _.merge(paramObject, dto);
        if (!dto.slug && dtoName !== paramName) {
          // check if slug is created automatically
          if (_.includes(paramSlug, createSlug(paramName))) {
            if (_.has(dto, 'title')) dbObject.slug = createSlugWithDateTime(dtoName);
            if (_.has(dto, 'name')) dbObject.slug = createSlug(dtoName);
          }
        }
      }
      // Find Parent
      if (dto.parentId) {
        const parentDbObject = await this.baseRepository.findOne(dto.parentId);
        if (parentDbObject) {
          dbObject.parentItem = parentDbObject;
        } else {
          throw new BadRequestException([
            {
              constraints: {
                isForeignKey: 'parentId must be an existed foreign key'
              },
              property: 'parentId'
            }
          ]);
        }
      }
      // Save
      const result = await this.baseRepository.save(dbObject);
      const newObject = await this.baseRepository.findOneByIdOrFail(result.id);
      return newObject;
    } catch (error) {
      if (error.code === '23505') {
        const existedKey = extractExistedKey(error.detail);
        throw new ConflictException(`${existedKey} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * GET TRASH
   * @param user CurrentUser
   */
  @Name(CrudName.GET_TRASHED)
  @Get('trashed')
  @ApiOperation({ summary: 'Get deleted Record' })
  async getOverrideTrashed(@CurrentUser() user: any): Promise<any> {
    return this.getTrashed(user);
  }

  /**
   * GET MANY
   * @param req CrudRequest
   */
  @Name(CrudName.GET_MANY)
  @Get()
  @ApiOperation({ summary: 'Retrieve many Items' })
  async getManyOverride() {
    // Find Tree
    const data = await this.baseRepository.findTrees();
    // Get specific fields
    return getDeepFieldsFromCollection(
      data,
      ['id', 'name', 'slug', 'childrenItems'],
      'childrenItems'
    );
  }

  /**
   * GET ROOTS
   * @param req CrudRequest
   */
  @Name(CrudName.GET_MANY)
  @Get('roots')
  @ApiOperation({ summary: 'Retrieve many Root Items' })
  async getManyRoot() {
    return this.baseRepository.findRoots();
  }

  /**
   * GET CHILDREN
   * @param req CrudRequest
   */
  @Name(CrudName.GET_MANY)
  @ApiOperation({ summary: 'Retrieve many Children Items' })
  @Get(':id/children')
  async getChildren(@Param('id', new ParseIntPipe()) id: number) {
    const dbObject: any = await this.baseRepository.findOneByIdOrFail(id);
    const allDescendants = _.filter(
      await this.baseRepository.findDescendants(dbObject),
      (o: any) => o.id !== dbObject.id
    );

    // Find Ids of descendants which have nested descendants
    const middleDescendantsIds = _.flatten(
      _.compact(
        await Promise.all(
          allDescendants.map(async (e: any) => {
            if (e.id !== dbObject.id) {
              const subDescendants = _.filter(
                await this.baseRepository.findDescendants(e),
                (o: any) => o.id !== e.id
              );
              if (!_.isEmpty(subDescendants))
                return getValueOfKeyFromCollection(subDescendants, 'id');
              return null;
            }
            return null;
          })
        )
      )
    );

    // Descendants returning to Client
    const finalDescendants = _.filter(
      allDescendants,
      (o: any) => !_.includes(middleDescendantsIds, o.id)
    );
    return finalDescendants;
  }

  /**
   * GET PARENT
   * @param req CrudRequest
   */
  @Name(CrudName.GET_MANY)
  @ApiOperation({ summary: 'Retrieve One Parent Item' })
  @Get(':id/parents')
  async getParent(@Param('id', new ParseIntPipe()) id: number) {
    const dbObject = await this.baseRepository.findRawOneByIdOrFail(id);
    const parents = await this.baseRepository.findRawParentByParentId(
      dbObject.parentItemId
    );
    return _.omit(parents, ['mpath', 'parentId']);
  }

  /**
   * CREATE ONE
   * @param req CrudRequest
   * @param dto T
   */
  @Name(CrudName.CREATE_ONE)
  async createOneOverride(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: T) {
    const dbObject: any = {};
    return this.saveObject(dbObject, dto);
  }

  /**
   * CREATE MANY
   * @param req CrudRequest
   * @param dto T
   */
  @Name(CrudName.CREATE_MANY)
  async createManyOverride(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<T>) {
    const result = await Promise.all(
      dto.bulk.map(async (e: any) => {
        const dbObject: any = {};
        const callbackResult = await this.saveObject(dbObject, e);
        return callbackResult;
      })
    );
    return result;
  }

  /**
   * UPDATE ONE
   * @param dto UpdateTDto
   * @param param
   */
  @Name(CrudName.UPDATE_ONE)
  async updateOneOverride(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: any) {
    const id = req.parsed.paramsFilter[0].value;
    const dbObject = await this.baseRepository.findOneByIdOrFail(id);
    if (dto.parentId) {
      throw new BadRequestException([
        {
          constraints: {
            isEmpty: 'parentId must be empty'
          },
          property: 'parentId'
        }
      ]);
    }
    return this.saveObject(dbObject, dto);
  }

  /**
   * GET ONE
   * @param id Param
   * @param user CurrentUser
   */
  @Name(CrudName.GET_ONE)
  @ApiOperation({ summary: 'Get one Record' })
  @Get(':id')
  async GetOneOverride(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any): Promise<T> {
    return this.GetOneBase(id, user);
  }
}
