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
  BadRequestException
} from '@nestjs/common';
import { CrudController, Override } from '@nestjsx/crud';
import { ApiOperation } from '@nestjs/swagger';
import { ACL } from '@src/common/decorators/acl.decorator';
import { AccessControlList } from '@src/common/enums/accessControlList';
import { CurrentUser } from '@src/common/decorators/currentUser.decorator';
import { intersectPermission } from '@src/core/utils/appHelper';
import * as _ from 'lodash';
import { BaseRepository } from '../Repository/index.repository';

export class BaseController<T> implements CrudController<T> {
  service: import('@nestjsx/crud').CrudService<T>;

  constructor(private readonly baseRepository: BaseRepository<T>) {}

  get base(): CrudController<T> {
    return this;
  }

  handleSelfPermissionOrFail(
    action: 'READ' | 'DELETE' | 'PERMANENTLY_DELETE',
    result: any,
    user: any
  ): boolean {
    const highPermission = [
      'ALL',
      `${_.toUpper(this.baseRepository.metadata.targetName)}_${action}`
    ];
    const requiredPermission = `SELF_${_.toUpper(
      this.baseRepository.metadata.targetName
    )}_${action}`;
    if (intersectPermission(user.permissions, highPermission)) return true;
    if (intersectPermission(user.permissions, requiredPermission)) {
      if (result[user.idForeignKey] !== user.id) {
        throw new ForbiddenException();
      } else {
        return true;
      }
    }
    return false;
  }

  @Get('trashed')
  @ACL(AccessControlList.DEFAULT)
  @ApiOperation({ summary: 'Get deleted Record' })
  async getTrashed(@CurrentUser() user: any): Promise<any> {
    // SELF_${BASE}_READ
    const highPermission = `${_.toUpper(
      this.baseRepository.metadata.targetName
    )}_READ`;
    const requiredPermission = `SELF_${_.toUpper(
      this.baseRepository.metadata.targetName
    )}_READ`;
    let result;
    if (
      !intersectPermission(user.permissions, highPermission) &&
      intersectPermission(user.permissions, requiredPermission)
    ) {
      // handle SELF_${BASE}_READ
      result = await this.baseRepository.getManyWithSelfTrashed(
        user.id,
        user.idForeignKey
      );
    } else {
      result = await this.baseRepository.getManyWithTrashed();
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

  @ApiOperation({ summary: 'Soft delete one record ' })
  @ACL(AccessControlList.DEFAULT)
  @Override('deleteOneBase')
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

  @ACL(AccessControlList.DEFAULT)
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

  @ACL(AccessControlList.DEFAULT)
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

  async GetOneBaseBySlug(@Param('slug') slug: string): Promise<T> {
    return this.baseRepository.findOneBySlugOrFail(slug);
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get one Record' })
  @Override('getOneBase')
  async GetOneBase(@Param('id', ParseIntPipe) id: number): Promise<T> {
    return this.baseRepository.findOneByIdOrFail(id);
  }
}
