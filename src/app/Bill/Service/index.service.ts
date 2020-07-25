import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BillRepository } from '../Repository/index.repository';
import { Bill } from '../index.entity';

@Injectable()
export class BillService extends TypeOrmCrudService<Bill> {
  constructor(@InjectRepository(Bill) repo, private readonly billRepository: BillRepository) {
    super(repo);
  }
}
