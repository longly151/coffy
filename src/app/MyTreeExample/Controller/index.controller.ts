import { Controller } from '@nestjs/common';
import {
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto
} from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Name } from '@common/decorators/crudName.decorator';
import { TreeBaseController } from '@app/Common/TreeBase/Controller/index.controller';
import { CrudName } from '@common/enums/crudName.enum';
import { MyTreeExample } from '../index.entity';
import { MyTreeExampleService } from '../Service/index.service';
import { MyTreeExampleRepository } from '../Repository/index.repository';

@UseCrud(MyTreeExample, {
  routes: {
    exclude: ['getManyBase', 'getOneBase', 'replaceOneBase', 'deleteOneBase']
  }
})
@ApiTags('my_tree_examples')
@Controller('my_tree_examples')
export class MyTreeExampleController extends TreeBaseController<MyTreeExample> {
  constructor(public service: MyTreeExampleService, private readonly repository: MyTreeExampleRepository) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */
  @Name(CrudName.CREATE_ONE) @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: MyTreeExample) { return this.createOneOverride(req, dto); }

  @Name(CrudName.CREATE_MANY) @Override('createManyBase')
  async createMany(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<MyTreeExample>) { return this.createManyOverride(req, dto); }

  @Name(CrudName.UPDATE_ONE) @Override('updateOneBase')
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: MyTreeExample) { return this.updateOneOverride(req, dto); }

  /**
   * Custom Method
   */
}
