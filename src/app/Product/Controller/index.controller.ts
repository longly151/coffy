import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BaseController } from '@app/Common/Base/Controller/index.controller';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Override, ParsedRequest, CrudRequest, ParsedBody, CreateManyDto } from '@nestjsx/crud';
import { CrudName } from '@common/enums/crudName.enum';
import { Name } from '@common/decorators/crudName.decorator';
import { ApplyAuth } from '@common/decorators/applyAuth.decorator';
import { ProductRepository } from '../Repository/index.repository';
import { ProductService } from '../Service/index.service';
import { Product } from '../index.entity';

@ApplyAuth(
  CrudName.GET_TRASHED,
  CrudName.CREATE_ONE,
  CrudName.CREATE_MANY,
  CrudName.UPDATE_ONE,
  CrudName.DELETE_ONE,
  CrudName.DELETE_ONE_PERMANENTLY,
  CrudName.RESTORE_ONE
)
@UseCrud(Product, {
  query: {
    join: {
      category: {
        allow: ['name'],
        eager: true
      }
    }
  }
})

@ApiTags('products')
@Controller('products')
export class ProductController extends BaseController<Product> {
  constructor(public service: ProductService, private readonly repository: ProductRepository) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */
  @Name(CrudName.CREATE_ONE) @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Product) { return this.createOneOverride(req, dto); }

  @Name(CrudName.CREATE_MANY) @Override('createManyBase')
  async createMany(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<Product>) { return this.createManyOverride(req, dto); }

  @Name(CrudName.UPDATE_ONE) @Override('updateOneBase')
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Product) { return this.updateOneOverride(req, dto); }


  @Name(CrudName.GET_ONE)
  @ApiOperation({ summary: 'Get one Record by Slug' })
  @Get('slug-:slug')
  async GetOneBaseBySlug(@Param('slug') slug: string): Promise<Product> {
    return this.baseRepository.findOneBySlugOrFail(slug);
  }

  /**
   * Custom Method
   */
}
