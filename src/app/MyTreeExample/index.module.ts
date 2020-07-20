import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyTreeExampleController } from './Controller/index.controller';
import { MyTreeExampleService } from './Service/index.service';
import { MyTreeExampleRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MyTreeExampleRepository])],
  controllers: [MyTreeExampleController],
  providers: [MyTreeExampleService],
  exports: [MyTreeExampleService]
})
export class MyTreeExampleModule {}
