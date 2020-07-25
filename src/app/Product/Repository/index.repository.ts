import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@app/Common/Base/Repository/index.repository';
import { Product } from '../index.entity';

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {}
