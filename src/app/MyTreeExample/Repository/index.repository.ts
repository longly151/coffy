import { EntityRepository } from 'typeorm';
import { TreeBaseRepository } from '@app/Common/TreeBase/Repository/index.repository';
import { MyTreeExample } from '../index.entity';

@EntityRepository(MyTreeExample)
export class MyTreeExampleRepository extends TreeBaseRepository<MyTreeExample> {}
