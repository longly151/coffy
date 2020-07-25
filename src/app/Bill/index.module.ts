import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from './Controller/index.controller';
import { BillService } from './Service/index.service';
import { BillRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BillRepository])],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService]
})
export class BillModule {}
