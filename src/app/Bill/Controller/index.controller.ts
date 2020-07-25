import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '@app/Common/Base/Controller/index.controller';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Override, ParsedRequest, CrudRequest, ParsedBody, CreateManyDto } from '@nestjsx/crud';
import { CrudName } from '@common/enums/crudName.enum';
import { Name } from '@common/decorators/crudName.decorator';
import { BillRepository } from '../Repository/index.repository';
import { BillService } from '../Service/index.service';
import { Bill } from '../index.entity';

@UseCrud(Bill, {
  query: {
    join: {
      productBills: {
        allow: ['billId', 'productId', 'pricePerUnit', 'quantity'],
        eager: true
      },
      'productBills.product': {
        eager: true
      }
    }
  },
  routes: {
    exclude:
    [
      'getOneBase',
      'createManyBase',
      'replaceOneBase',
      'deleteOneBase'
    ]
  }
})
@ApiTags('bills')
@Controller('bills')
export class BillController extends BaseController<Bill> {
  constructor(public service: BillService, private readonly repository: BillRepository) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */
  @Name(CrudName.CREATE_ONE) @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Bill) {
    console.log('dto', dto);

    return this.createOneOverride(req, dto);
  }

  @Name(CrudName.UPDATE_ONE) @Override('updateOneBase')
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Bill) { return this.updateOneOverride(req, dto); }

  /**
   * Custom Method
   */
}
