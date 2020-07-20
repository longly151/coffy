import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MyTreeExample } from '../index.entity';
import { MyTreeExampleRepository } from '../Repository/index.repository';

@Injectable()
export class MyTreeExampleService extends TypeOrmCrudService<MyTreeExample> {
  constructor(@InjectRepository(MyTreeExample) repo, private readonly repository: MyTreeExampleRepository) {
    super(repo);
  }
}
