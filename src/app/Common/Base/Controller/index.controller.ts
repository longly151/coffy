import { CrudName } from '@common/enums/crudName.enum';
import {
  Delete,
  ParseIntPipe,
  Param,
  Patch,
  Get,
  NotFoundException,
  HttpException,
  HttpStatus,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException
} from '@nestjs/common';
import { CrudController, ParsedRequest, CrudRequest, ParsedBody, CreateManyDto } from '@nestjsx/crud';
import { ApiOperation } from '@nestjs/swagger';
import { Name } from '@common/decorators/crudName.decorator';
import { CurrentUser } from '@common/decorators/currentUser.decorator';
import { intersectPermission, extractExistedKey } from '@core/utils/appHelper';
import _ from 'lodash';
import { AccessControlList } from '@common/enums/accessControlList.enum';
import { BaseRepository } from '../Repository/index.repository';

export class BaseController<T> implements CrudController<T> {
  service: import('@nestjsx/crud').CrudService<T>;

  constructor(protected readonly baseRepository: BaseRepository<T>) {}

  get base(): CrudController<T> {
    return this;
  }

  handleSelfPermissionOrFail(
    action: 'READ' | 'DELETE' | 'PERMANENTLY_DELETE',
    result: any,
    user: any
  ): boolean {
    if(!user) return true;

    const higherPermission = [
      'ALL',
      `${_.toUpper(this.baseRepository.metadata.targetName)}_${action}`
    ];
    const requiredPermission = `SELF_${_.toUpper(
      this.baseRepository.metadata.targetName
    )}_${action}`;
    if (intersectPermission(user.permissions, higherPermission)) return true;
    if (intersectPermission(user.permissions, requiredPermission)) {
      if (result[user.idForeignKey] !== user.id) {
        throw new ForbiddenException();
      } else {
        return true;
      }
    }
    return false;
  }

  @Name(CrudName.GET_TRASHED)
  @Get('trashed')
  @ApiOperation({ summary: 'Get deleted Record' })
  async getTrashed(@CurrentUser() user: any): Promise<any> {
    let result;
    if(!user || _.includes(user.permissions, AccessControlList.ALL)) result = await this.baseRepository.getManyWithTrashed();
    else {
      const higherPermission = `${_.toUpper(
        this.baseRepository.metadata.targetName
      )}_READ`;
      const requiredPermission = `SELF_${_.toUpper(
        this.baseRepository.metadata.targetName
      )}_READ`;
      if (intersectPermission(user.permissions, higherPermission)) {
        result = await this.baseRepository.getManyWithTrashed();
      } else if (
        !intersectPermission(user.permissions, higherPermission) &&
  intersectPermission(user.permissions, requiredPermission)) {
        // handle SELF_${BASE}_READ
        result = await this.baseRepository.getManyWithSelfTrashed(
          user.id,
          user.idForeignKey
        );
      }
    }
    // Remove password field
    if (!_.isEmpty(result)) {
      if (_.has(result[0], 'password')) {
        result = _.map(result, (item: any) => {
          return _.omit(item, ['password']);
        });
      }
    }
    return result;
  }

  @Name(CrudName.DELETE_ONE)
  @ApiOperation({ summary: 'Soft delete one record ' })
  @Delete(':id')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any
  ): Promise<void> {
    const result = await this.baseRepository.findOne(id);
    if (this.handleSelfPermissionOrFail('DELETE', result, user)) {
      if (!result)
        throw new NotFoundException(
          `${this.baseRepository.metadata.targetName} not found`
        );
      else await this.baseRepository.softDelete(id);
    }
  }

  @Name(CrudName.DELETE_ONE_PERMANENTLY)
  @Delete(':id/permanently')
  @ApiOperation({ summary: 'Permanently delete one record ' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any
  ): Promise<void> {
    const result = await this.baseRepository.findOne(id);
    const trashedResult = await this.baseRepository.getOneByIdWithTrashed(id);
    if (this.handleSelfPermissionOrFail('PERMANENTLY_DELETE', result, user)) {
      if (result)
        throw new BadRequestException(
          `Permanently Delete only effects on Deleted ${this.baseRepository.metadata.targetName}`
        );
      if (!result && _.isEmpty(trashedResult))
        throw new NotFoundException(
          `${this.baseRepository.metadata.targetName} not found`
        );
      else {
        try {
          await this.baseRepository.delete(id);
        } catch (error) {
          if (error.code === '23503') {
            throw new InternalServerErrorException(
              'Update or Delete violates foreign key constraint'
            );
          }
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Name(CrudName.RESTORE_ONE)
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore one record ' })
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any
  ): Promise<void> {
    const result = await this.baseRepository.findOne(id);
    const trashedResult = await this.baseRepository.getOneByIdWithTrashed(id);
    if (this.handleSelfPermissionOrFail('DELETE', result, user)) {
      if (!result && _.isEmpty(trashedResult))
        throw new NotFoundException(
          `${this.baseRepository.metadata.targetName} not found`
        );
      if (result) throw new HttpException({}, HttpStatus.NOT_MODIFIED);
      else await this.baseRepository.restore(id);
    }
  }

  /**
   * Override CRUD Method
   */

  @Name(CrudName.CREATE_ONE)
  async createOneOverride(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: T) {
    try {
      const result = await this.base.createOneBase(req, dto);
      return result;
    } catch (error) {
      let existedKey = '';
      switch(error.code) {
        case '23503':
          existedKey = extractExistedKey(error.detail);
          throw new ConflictException(`The value of ${existedKey} is not exists`);
        case '23505':
          existedKey = _.capitalize(extractExistedKey(error.detail));
          throw new ConflictException(`${existedKey} already exists`);
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  @Name(CrudName.UPDATE_ONE)
  async updateOneOverride(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: T) {
    try {
      const result = await this.base.updateOneBase(req, dto);
      return result;
    } catch (error) {
      let existedKey = '';
      switch(error.code) {
        case '23503':
          existedKey = extractExistedKey(error.detail);
          throw new ConflictException(`The value of ${existedKey} is not exists`);
        case '23505':
          existedKey = _.capitalize(extractExistedKey(error.detail));
          throw new ConflictException(`${existedKey} already exists`);
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  @Name(CrudName.CREATE_MANY)
  async createManyOverride(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<T>
  ) {
    try {
      const result = await this.base.createManyBase(req, dto);
      return result;
    } catch (error) {
      let existedKey = '';
      switch(error.code) {
        case '23503':
          existedKey = extractExistedKey(error.detail);
          throw new ConflictException(`The value of ${existedKey} is not exists`);
        case '23505':
          existedKey = _.capitalize(extractExistedKey(error.detail));
          throw new ConflictException(`${existedKey} already exists`);
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Custom CRUD Base
   */

  @Name(CrudName.GET_ONE)
  @ApiOperation({ summary: 'Get one Record by Slug' })
  async GetOneBaseBySlug(@Param('slug') slug: string): Promise<T> {
    return this.baseRepository.findOneBySlugOrFail(slug);
  }

  @Name(CrudName.GET_ONE)
  @Get(':id')
  @ApiOperation({ summary: 'Get one Record' })
  async GetOneBase(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any): Promise<T> {
    const result: any = await this.baseRepository.findOneByIdOrFail(id);
    if (this.handleSelfPermissionOrFail('READ', result, user)) {
      // Remove password field
      if (!_.isEmpty(result)) {
        if (_.has(result, 'password')) {
          return _.omit(result, ['password']);
        }
        return result;
      }
    }
    return null;
  }
}
