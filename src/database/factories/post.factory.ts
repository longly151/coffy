/* eslint-disable @typescript-eslint/no-unused-vars */
import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { enumToArray } from '../../core/utils/helper';
import { Post } from '../../app/Post/index.entity';
import { PostStatus } from '../../common/enums/postStatus.enum';
import { Gender } from '../../common/enums/gender.enum';

define(Post, (faker: typeof Faker, context: { categoryLength: number }) => {
  const { categoryLength } = context;
  const title = faker.lorem.sentence();
  const slug = faker.lorem.slug();
  const description = faker.lorem.paragraph();
  const content = faker.lorem.paragraphs();
  const thumbnail = 'https://picsum.photos/500/500';
  const categoryId = faker.random.number({ min: 1, max: categoryLength });

  const post = new Post();
  post.title = title;
  post.slug = slug;
  post.description = description;
  post.content = content;
  post.thumbnail = thumbnail;
  post.categoryId = categoryId;

  return post;
});
