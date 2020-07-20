import { EntityRepository } from 'typeorm';
import { TreeBaseRepository } from '@app/Common/TreeBase/Repository/index.repository';
import { Category } from '../index.entity';

@EntityRepository(Category)
export class CategoryRepository extends TreeBaseRepository<Category> {}
