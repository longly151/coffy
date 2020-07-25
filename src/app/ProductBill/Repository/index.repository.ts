import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@app/Common/Base/Repository/index.repository';
import { ProductBill } from '../index.entity';

@EntityRepository(ProductBill)
export class ProductBillRepository extends BaseRepository<ProductBill> {}
