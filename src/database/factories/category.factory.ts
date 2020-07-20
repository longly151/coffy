import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as _ from 'lodash';
import { createSlug, enumToArray } from '../../core/utils/helper';
import { Category } from '../../app/Category/index.entity';
import { TreeLevel } from '../enum/tree.enum';
import { PostStatus } from '../../common/enums/postStatus.enum';

define(Category, (
  faker: typeof Faker,
  context: { type: TreeLevel; parents: Category }
) => {
  const { parents, type } = context;
  /**
   * Faker & New Item
   */
  // faker.locale = 'vi';
  const name = _.startCase(_.camelCase(faker.lorem.words()));
  const description = faker.lorem.paragraph();
  const content = faker.lorem.paragraphs();
  const slug = createSlug(name);
  const status = faker.random.arrayElement(enumToArray(PostStatus));
  const thumbnail = faker.image.imageUrl();

  const category = new Category();
  category.name = name;
  category.slug = slug;
  category.description = description;
  category.content = content;
  category.status = status;
  category.thumbnail = thumbnail;

  /**
   * Create Relations
   */
  if (type === TreeLevel.ROOT) return category;
  if (type === TreeLevel.NODE) {
    const sample: any = _.sample(parents);
    category.parentItem = sample;
    return category;
  }
  return category;
});
