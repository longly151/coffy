import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '@app/Common/Base/Controller/index.controller';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Override, ParsedRequest, CrudRequest, ParsedBody, CreateManyDto } from '@nestjsx/crud';
import { CrudName } from '@common/enums/crudName.enum';
import { Name } from '@common/decorators/crudName.decorator';
import { ApplyAuth } from '@common/decorators/applyAuth.decorator';
import { PostRepository } from '../Repository/index.repository';
import { PostService } from '../Service/index.service';
import { Post } from '../index.entity';

@ApplyAuth(
  CrudName.GET_TRASHED,
  CrudName.CREATE_ONE,
  CrudName.CREATE_MANY,
  CrudName.UPDATE_ONE,
  CrudName.DELETE_ONE,
  CrudName.DELETE_ONE_PERMANENTLY,
  CrudName.RESTORE_ONE
)
@UseCrud(Post, {
  query: {
    join: {
      category: {
        allow: ['name'],
        eager: true
      }
    }
  }
})

@ApiTags('posts')
@Controller('posts')
export class PostController extends BaseController<Post> {
  constructor(public service: PostService, private readonly repository: PostRepository) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */
  @Name(CrudName.CREATE_ONE) @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Post) { return this.createOneOverride(req, dto); }

  @Name(CrudName.CREATE_MANY) @Override('createManyBase')
  async createMany(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<Post>) { return this.createManyOverride(req, dto); }

  @Name(CrudName.UPDATE_ONE) @Override('updateOneBase')
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Post) { return this.updateOneOverride(req, dto); }

  /**
   * Custom Method
   */
}
