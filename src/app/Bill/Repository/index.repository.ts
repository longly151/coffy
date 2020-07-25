import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@app/Common/Base/Repository/index.repository';
import { Bill } from '../index.entity';

@EntityRepository(Bill)
export class BillRepository extends BaseRepository<Bill> {}
