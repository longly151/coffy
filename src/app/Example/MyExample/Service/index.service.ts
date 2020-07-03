import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { MyExampleRepository } from "../Repository/index.repository";
import { MyExample } from "../myExample.entity";

@Injectable()
export class MyExampleService extends TypeOrmCrudService<MyExample> {
  constructor(
    @InjectRepository(MyExample) repo,
    private readonly myExampleRepository: MyExampleRepository
  ) {
    super(repo);
  }
}
