import * as Faker from "faker";
import { define } from "typeorm-seeding";
import * as _ from "lodash";
import { createSlug, enumToArray } from "../../core/utils/helper";
import { ServiceCategory } from "../../app/ServiceCategory/serviceCategory.entity";
import { TreeLevel } from "../enum/tree.enum";
import { PostStatus } from "../../common/enums/postStatus.enum";

define(ServiceCategory, (
  faker: typeof Faker,
  context: { type: TreeLevel; parents: ServiceCategory }
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

  const destination = new ServiceCategory();
  destination.name = name;
  destination.slug = slug;
  destination.description = description;
  destination.content = content;
  destination.status = status;
  destination.thumbnail = thumbnail;

  /**
   * Create Relations
   */
  if (type === TreeLevel.ROOT) return destination;
  if (type === TreeLevel.NODE) {
    const sample = _.sample(parents);
    destination.parentItem = sample;
    return destination;
  }
});
