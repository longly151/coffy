import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '@app/Common/Base/Controller/index.controller';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Override, ParsedRequest, CrudRequest, ParsedBody, CreateManyDto } from '@nestjsx/crud';
import { CrudName } from '@common/enums/crudName.enum';
import { Name } from '@common/decorators/crudName.decorator';
import { ProductBillRepository } from '../Repository/index.repository';
import { ProductBillService } from '../Service/index.service';
import { ProductBill } from '../index.entity';

@UseCrud(ProductBill)
@ApiTags('product_bills')
@Controller('product_bills')
export class ProductBillController extends BaseController<ProductBill> {
  constructor(public service: ProductBillService, private readonly repository: ProductBillRepository) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */
  @Name(CrudName.CREATE_ONE) @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: ProductBill) { return this.createOneOverride(req, dto); }

  @Name(CrudName.CREATE_MANY) @Override('createManyBase')
  async createMany(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<ProductBill>) { return this.createManyOverride(req, dto); }

  @Name(CrudName.UPDATE_ONE) @Override('updateOneBase')
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: ProductBill) { return this.updateOneOverride(req, dto); }

  /**
   * Custom Method
   */
}
