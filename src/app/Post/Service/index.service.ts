import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PostRepository } from '../Repository/index.repository';
import { Post } from '../index.entity';

@Injectable()
export class PostService extends TypeOrmCrudService<Post> {
  constructor(@InjectRepository(Post) repo, private readonly myExampleRepository: PostRepository) {
    super(repo);
  }
}
