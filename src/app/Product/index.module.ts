import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './Controller/index.controller';
import { ProductService } from './Service/index.service';
import { ProductRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
