import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProductRepository } from '../Repository/index.repository';
import { Product } from '../index.entity';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) repo, private readonly myExampleRepository: ProductRepository) {
    super(repo);
  }
}
