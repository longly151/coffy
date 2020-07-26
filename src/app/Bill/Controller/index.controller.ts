import { Controller, ConflictException, InternalServerErrorException, Post, ParseIntPipe, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '@app/Common/Base/Controller/index.controller';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Override, ParsedRequest, CrudRequest, ParsedBody, CreateManyDto } from '@nestjsx/crud';
import { CrudName } from '@common/enums/crudName.enum';
import { Name } from '@common/decorators/crudName.decorator';
import { extractExistedKey } from '@core/utils/appHelper';
import _ from 'lodash';
import { BillDetail } from '@common/type/billDetail.type';
import { getManager, getConnection } from 'typeorm';
import { ProductRepository } from '@app/Product/Repository/index.repository';
import { BillStatus } from '@common/enums/billStatus.enum';
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
  constructor(
    public service: BillService,
    private readonly repository: BillRepository,
    private readonly productRepository: ProductRepository
  ) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */
  @Name(CrudName.CREATE_ONE) @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Bill) {
    try {
      const handledDto = dto;

      let subTotal = 0;
      await Promise.all(dto.details.map(async (detail: BillDetail) => {
        const pricePerUnit = (await this.productRepository.findOneByIdOrFail(detail.productId)).price;
        subTotal += detail.quantity * pricePerUnit;
      }));
      handledDto.subTotal = subTotal;

      const result = await this.createOneOverride(req, handledDto);
      await Promise.all(handledDto.details.map(async (detail: BillDetail) => {
        const fullDetail: any = { ...detail };
        fullDetail.pricePerUnit = (await this.productRepository.findOneByIdOrFail(detail.productId)).price;
        fullDetail.billId = result.id;
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into('product_bills')
          .values(fullDetail)
          .execute();
      }));
      return this.repository.findOneByIdOrFail(result.id);
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

  @Name(CrudName.UPDATE_ONE) @Override('updateOneBase')
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Bill) { return this.updateOneOverride(req, dto); }

  /**
   * Custom Method
   */
  @Name(CrudName.CREATE_ONE) @Post(':id/done')
  async checkDone(@Param('id', ParseIntPipe) id: number) {
    try {
      let dbObject: any = await this.repository.findOneByIdOrFail(id);
      dbObject.status = BillStatus.DONE;
      dbObject = _.omit(dbObject, 'productBills');
      return this.repository.save(dbObject);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
