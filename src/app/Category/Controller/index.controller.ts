import { Controller, Get, Param } from '@nestjs/common';
import {
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto
} from '@nestjsx/crud';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Name } from '@common/decorators/crudName.decorator';
import { TreeBaseController } from '@app/Common/TreeBase/Controller/index.controller';
import { CrudName } from '@common/enums/crudName.enum';
import { ApplyAuth } from '@common/decorators/applyAuth.decorator';
import { BaseController } from '@base/Controller/index.controller';
import { Category } from '../index.entity';
import { CategoryService } from '../Service/index.service';
import { CategoryRepository } from '../Repository/index.repository';

@ApplyAuth(
  CrudName.GET_TRASHED,
  CrudName.CREATE_ONE,
  CrudName.CREATE_MANY,
  CrudName.UPDATE_ONE,
  CrudName.DELETE_ONE,
  CrudName.DELETE_ONE_PERMANENTLY,
  CrudName.RESTORE_ONE
)
@UseCrud(Category)
@ApiTags('categories')
@Controller('categories')
export class CategoryController extends BaseController<Category> {
  constructor(public service: CategoryService, private readonly repository: CategoryRepository) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */
  @Name(CrudName.CREATE_ONE) @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Category) { return this.createOneOverride(req, dto); }

  @Name(CrudName.CREATE_MANY) @Override('createManyBase')
  async createMany(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<Category>) { return this.createManyOverride(req, dto); }

  @Name(CrudName.UPDATE_ONE) @Override('updateOneBase')
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Category) { return this.updateOneOverride(req, dto); }

  /**
   * Custom Method
   */

  @Name(CrudName.GET_ONE)
  @ApiOperation({ summary: 'Get one Record by Slug' })
  @Get(':slug')
  async GetOneBaseBySlug(@Param('slug') slug: string): Promise<Category> {
    return this.baseRepository.findOneBySlugOrFail(slug);
  }
}
