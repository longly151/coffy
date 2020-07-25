import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBillRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBillRepository])]
})
export class ProductBillModule {}
