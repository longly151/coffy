/* eslint-disable @typescript-eslint/no-unused-vars */
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, getConnection } from 'typeorm';
import { Role } from '../../app/Role/index.entity';


export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const admin = {
      name: 'ADMIN',
      description: 'ADMIN'
      // accessControlList: [AccessControlList.ALL]
    };
    const operator = {
      name: 'OPERATOR',
      description: 'OPERATOR'
      // accessControlList: _.sampleSize(enumToArray(AccessControlList), 4)
    };
    const sale = {
      name: 'SALE',
      description: 'SALE'
      // accessControlList: _.sampleSize(enumToArray(AccessControlList), 2)
    };
    const intern = {
      name: 'INTERN',
      description: 'INTERN'
      // accessControlList: _.sampleSize(enumToArray(AccessControlList), 2)
    };
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([admin, operator, sale, intern])
      .execute();
  }
}
