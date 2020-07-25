import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBillController } from './Controller/index.controller';
import { ProductBillService } from './Service/index.service';
import { ProductBillRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBillRepository])],
  controllers: [ProductBillController],
  providers: [ProductBillService],
  exports: [ProductBillService]
})
export class ProductBillModule {}
