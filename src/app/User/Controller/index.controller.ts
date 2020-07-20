import {
  Controller
} from '@nestjs/common';
import {
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto
} from '@nestjsx/crud';
import { BaseController } from '@app/Common/Base/Controller/index.controller';
import {
  ApiTags
} from '@nestjs/swagger';
import { Name } from '@common/decorators/crudName.decorator';
import { UseCrud } from '@common/decorators/crud.decorator';
import { CrudName } from '@common/enums/crudName.enum';
import { ApplyAuth } from '@common/decorators/applyAuth.decorator';
import { UserService } from '../Service/index.service';
import { User } from '../index.entity';
import { UserRepository } from '../Repository/index.repository';

@ApplyAuth(CrudName.ALL)
@UseCrud(User, {
  query: {
    exclude: ['password'],
    join: {
      role: {
        allow: ['name'],
        eager: true
      },
      'role.permissions': {
        eager: true
      }
    }
  }
})
@ApiTags('users')
@Controller('users')
export class UserController extends BaseController<User> {
  constructor(
    public service: UserService,
    private readonly repository: UserRepository
  ) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */
  @Name(CrudName.CREATE_ONE) @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) { return this.createOneOverride(req, dto); }

  @Name(CrudName.CREATE_MANY) @Override('createManyBase')
  async createMany(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<User>) { return this.createManyOverride(req, dto); }

  @Name(CrudName.UPDATE_ONE) @Override('updateOneBase')
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) { return this.updateOneOverride(req, dto); }

}
