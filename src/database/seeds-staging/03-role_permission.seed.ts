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
          permissionId: 3
        },
        {
          roleId: 2,
          permissionId: 13
        },
        {
          roleId: 2,
          permissionId: 17
        },
        {
          roleId: 2,
          permissionId: 18
        },
        {
          roleId: 2,
          permissionId: 19
        },
        {
          roleId: 2,
          permissionId: 20
        },
        {
          roleId: 2,
          permissionId: 21
        },
        {
          roleId: 2,
          permissionId: 22
        },
        {
          roleId: 2,
          permissionId: 23
        },
        {
          roleId: 2,
          permissionId: 24
        },
        {
          roleId: 2,
          permissionId: 25
        },
        {
          roleId: 2,
          permissionId: 26
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
