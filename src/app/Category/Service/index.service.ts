import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Category } from '../index.entity';
import { CategoryRepository } from '../Repository/index.repository';

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
  constructor(@InjectRepository(Category) repo, private readonly repository: CategoryRepository) {
    super(repo);
  }
}
