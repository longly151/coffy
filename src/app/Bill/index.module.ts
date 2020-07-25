import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from '../Product/Repository/index.repository';
import { BillController } from './Controller/index.controller';
import { BillService } from './Service/index.service';
import { BillRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BillRepository, ProductRepository])],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService]
})
export class BillModule {}
