import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProductBillRepository } from '../Repository/index.repository';
import { ProductBill } from '../index.entity';

@Injectable()
export class ProductBillService extends TypeOrmCrudService<ProductBill> {
  constructor(@InjectRepository(ProductBill) repo, private readonly productBillRepository: ProductBillRepository) {
    super(repo);
  }
}
