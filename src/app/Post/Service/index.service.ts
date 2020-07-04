import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PostRepository } from '../Repository/index.repository';
import { Post } from '../post.entity';

@Injectable()
export class PostService extends TypeOrmCrudService<Post> {
  constructor(
    @InjectRepository(Post) repo,
    private readonly PostRepository: PostRepository
  ) {
    super(repo);
  }
}
