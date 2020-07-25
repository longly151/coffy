import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@app/Common/Base/Repository/index.repository';
import { Category } from '../index.entity';

@EntityRepository(Category)
export class CategoryRepository extends BaseRepository<Category> {}
