/* eslint-disable @typescript-eslint/no-unused-vars */
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, getConnection } from 'typeorm';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into('role_permissions')
      .values([
        {
          roleId: 1,
          permissionId: 1
        },
        {
          roleId: 2,
          permissionId: 2
        },
        {
          roleId: 2,
          permissionId: 3
        },
        {
          roleId: 2,
          permissionId: 4
        },
        {
          roleId: 3,
          permissionId: 3
        },
        {
          roleId: 3,
          permissionId: 4
        },
        {
          roleId: 3,
          permissionId: 5
        }
      ])
      .execute();
  }
}
