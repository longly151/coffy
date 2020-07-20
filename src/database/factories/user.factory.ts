/* eslint-disable @typescript-eslint/no-unused-vars */
import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { enumToArray } from '../../core/utils/helper';
import { User } from '../../app/User/index.entity';
import { UserStatus } from '../../common/enums/userStatus.enum';
import { Gender } from '../../common/enums/gender.enum';

define(User, (faker: typeof Faker, context: { roles: string[] }) => {
  const fullName = faker.name.findName();
  const email = faker.internet.email(fullName);
  const password = faker.internet.password();
  const phoneNumber = faker.phone.phoneNumber();
  const avatar = faker.image.avatar();
  const gender = faker.random.arrayElement(enumToArray(Gender));
  const birthday = faker.date.between('1975/01/01', '2010/01/01');
  const bio = faker.lorem.paragraph();
  const note = faker.lorem.paragraph();
  const status = faker.random.arrayElement(enumToArray(UserStatus));
  const roleId = faker.random.number({ min: 2, max: 3 });

  const user = new User();
  user.fullName = fullName;
  user.email = email;
  user.password = password;
  user.phone = phoneNumber;
  user.avatar = avatar;
  user.gender = gender;
  user.birthday = birthday;
  user.bio = bio;
  user.note = note;
  user.status = status;
  user.roleId = roleId;

  return user;
});
