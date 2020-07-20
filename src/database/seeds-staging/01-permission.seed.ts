/* eslint-disable @typescript-eslint/no-unused-vars */
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, getConnection } from 'typeorm';
import { enumToArray } from '../../core/utils/helper';
import { Permission } from '../../app/Permission/index.entity';
import { AccessControlList } from '../../common/enums/accessControlList.enum';

export default class CreatePermissions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const permission = [];
    enumToArray(AccessControlList).map((item: string) => {
      if (item !== 'DEFAULT') {
        permission.push({
          name: item
        });
      }
      return permission;
    });

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values(permission)
      .execute();
  }
}
