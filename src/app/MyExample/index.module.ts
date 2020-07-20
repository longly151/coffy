import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyExampleController } from './Controller/index.controller';
import { MyExampleService } from './Service/index.service';
import { MyExampleRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MyExampleRepository])],
  controllers: [MyExampleController],
  providers: [MyExampleService],
  exports: [MyExampleService]
})
export class MyExampleModule {}
