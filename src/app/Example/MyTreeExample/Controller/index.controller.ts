import {
  Controller,
  ParseIntPipe,
  BadRequestException,
  Get,
  Param
} from '@nestjs/common';
import {
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto
} from '@nestjsx/crud';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UseCrud } from '@src/common/decorators/crud.decorator';
import { AccessControlList } from '@src/common/enums/accessControlList';
import { ACL } from '@src/common/decorators/acl.decorator';
import { getDeepFieldsFromCollection } from '@src/core/utils/helper';
import { TreeBaseController } from '@src/app/Common/TreeBase/Controller/index.controller';
import { CurrentUser } from '@src/common/decorators/currentUser.decorator';
import { MyTreeExample } from '../myTreeExample.entity';
import { MyTreeExampleService } from '../Service/index.service';
import { MyTreeExampleRepository } from '../Repository/index.repository';

@UseCrud(MyTreeExample, {
  routes: {
    exclude: ['getManyBase', 'getOneBase', 'replaceOneBase', 'deleteOneBase']
  }
})
@ApiTags('my_tree_examples')
@Controller('my_tree_examples')
export class MyTreeExampleController extends TreeBaseController<MyTreeExample> {
  constructor(
    public service: MyTreeExampleService,
    private readonly repository: MyTreeExampleRepository
  ) {
    super(repository);
  }

  /**
   * GET MANY (NO AUTH)
   * @param req CrudRequest
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve many MyTreeExample' })
  async getMany() {
    // Find Tree
    const data = await this.repository.findTrees();
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
  @Get('roots')
  @ApiOperation({ summary: 'Retrieve many Root MyTreeExample' })
  async getManyRoot() {
    return this.service.getManyRoot();
  }

  /**
   * GET CHILDREN
   * @param req CrudRequest
   */
  @ApiOperation({ summary: 'Retrieve many Children MyTreeExample' })
  @Get(':id/children')
  async getChildren(
    @Param('id', new ParseIntPipe())
      id: number
  ) {
    return this.service.getChildren(id);
  }

  /**
   * GET PARENT
   * @param req CrudRequest
   */
  @ApiOperation({ summary: 'Retrieve One Parent MyTreeExample' })
  @Get(':id/parents')
  async getParent(
    @Param('id', new ParseIntPipe())
      id: number
  ) {
    return this.service.getParent(id);
  }

  /**
   * CREATE ONE
   * @param req CrudRequest
   * @param dto MyTreeExample
   */
  @ACL(AccessControlList.DEFAULT)
  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: MyTreeExample
  ) {
    const dbObject = new MyTreeExample();
    return this.service.saveObject(dbObject, dto);
  }

  /**
   * CREATE MANY
   * @param req CrudRequest
   * @param dto MyTreeExample
   */
  @Override('createManyBase')
  @ACL(AccessControlList.DEFAULT)
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<MyTreeExample>
  ) {
    const result = await Promise.all(
      dto.bulk.map(async (e: any) => {
        const dbObject = new MyTreeExample();
        const callbackResult = await this.service.saveObject(dbObject, e);
        return callbackResult;
      })
    );
    return result;
  }

  /**
   * UPDATE ONE
   * @param dto UpdateMyTreeExampleDto
   * @param param
   */
  @Override('updateOneBase')
  @ACL(AccessControlList.DEFAULT)
  async updateOne(@ParsedBody() dto: MyTreeExample, @Param() param) {
    const dbObject = await this.repository.findOneByIdOrFail(param.id);
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
    return this.service.saveObject(dbObject, dto);
  }

  /**
   * GET TRASH
   * @param user CurrentUser
   */
  @Get('trashed')
  @ACL(AccessControlList.DEFAULT)
  @ApiOperation({ summary: 'Get deleted Record' })
  async getTrashedOverride(@CurrentUser() user: any): Promise<any> {
    return this.getTrashed(user);
  }

  /**
   * GET ONE
   * @param id Param
   * @param user CurrentUser
   */
  @ApiOperation({ summary: 'Get one Record' })
  @Override('getOneBase')
  @Get(':id')
  async GetOne(@Param('id', ParseIntPipe) id: number): Promise<MyTreeExample> {
    return this.GetOneBase(id);
  }
}
