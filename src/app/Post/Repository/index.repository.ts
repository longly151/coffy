import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@src/app/Common/Base/Repository/index.repository';
import { Post } from '../post.entity';

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {}
