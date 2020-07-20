import {
  Controller,
  Param,
  ParseIntPipe,
  BadRequestException,
  Post,
  Patch
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BaseController } from '@app/Common/Base/Controller/index.controller';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Name } from '@common/decorators/crudName.decorator';
import { ParsedBody } from '@nestjsx/crud';
import { UserRepository } from '@app/User/Repository/index.repository';
import { CrudName } from '@common/enums/crudName.enum';
import { ApplyAuth } from '@common/decorators/applyAuth.decorator';
import { RoleRepository } from '../Repository/index.repository';
import { RoleService } from '../Service/index.service';
import { Role } from '../index.entity';

@ApplyAuth(CrudName.ALL)
@UseCrud(Role, {
  routes: {
    exclude: [
      'getOneBase',
      'createOneBase',
      'createManyBase',
      'updateOneBase',
      'replaceOneBase',
      'deleteOneBase'
    ]
  },
  query: {
    join: {
      permissions: {
        allow: ['name'],
        eager: true
      }
    }
  }
})
@ApiTags('roles')
@Controller('roles')
export class RoleController extends BaseController<Role> {
  constructor(
    public service: RoleService,
    private readonly repository: RoleRepository,
    private readonly userRepository: UserRepository
  ) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */

  /**
   * CREATE ONE
   * @param req CrudRequest
   * @param dto Destination
   */
  @Name(CrudName.CREATE_ONE)
  @ApiOperation({ summary: 'Create one Role ' })
  @Post()
  async createOneRole(@ParsedBody() dto: Role) {
    const dbObject = new Role();
    return this.service.saveObject(dbObject, dto);
  }

  /**
   * UPDATE ONE
   * @param dto Role
   * @param id Param
   */
  @Name(CrudName.UPDATE_ONE)
  @ApiOperation({ summary: 'Update one Role ' })
  @Patch(':id')
  async updateOneRole(
    @ParsedBody() dto: Role,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (id === 1) {
      throw new BadRequestException('Cannot update ADMIN Role');
    }
    const dbObject = await this.repository.findOne(id);
    return this.service.saveObject(dbObject, dto);
  }
}
