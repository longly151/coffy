import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@app/Common/Base/Repository/index.repository';
import { MyExample } from '../index.entity';

@EntityRepository(MyExample)
export class MyExampleRepository extends BaseRepository<MyExample> {}
