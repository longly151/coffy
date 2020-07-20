import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@app/Common/Base/Repository/index.repository';
import { Post } from '../index.entity';

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {}
