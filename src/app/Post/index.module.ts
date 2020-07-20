import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './Controller/index.controller';
import { PostService } from './Service/index.service';
import { PostRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
