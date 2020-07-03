// import { Factory, Seeder } from 'typeorm-seeding';
// import { Connection, Table } from 'typeorm';
// import { Role } from '../../modules/roles/role.entity';

// export default class CreateRole implements Seeder {
//   public async run(factory: Factory, connection: Connection): Promise<any> {
//     // Create table
//     // const metadata = connection.getMetadata(Role);
//     // const queryRunner = connection.createQueryRunner();
//     // await queryRunner.dropTable(metadata.tableName);
//     // const newTable = Table.create(metadata, connection.driver);
//     // await queryRunner.createTable(newTable);

//     // Seeding
//     await connection
//       .createQueryBuilder()
//       .insert()
//       .into(Role)
//       .values([
//         {
//           name: UserRole.ADMIN,
//           description: 'ADMIN',
//         },
//         {
//           name: UserRole.MODERATOR,
//           description: 'MODERATOR',
//         },
//         {
//           name: UserRole.MEMBER,
//           description: 'MEMBER',
//         },
//       ])
//       .execute();
//   }
// }

import { Factory, Seeder } from "typeorm-seeding";
import { Connection, getConnection } from "typeorm";
import * as _ from "lodash";
import { Role } from "../../app/Role/role.entity";
import { UserRole } from "../../app/Role/Enum/userRole.enum";

import { AccessControlList } from "../../common/enums/accessControlList";
import { enumToArray } from "../../core/utils/helper";

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const admin = {
      name: "ADMIN",
      description: "ADMIN",
      // accessControlList: [AccessControlList.ALL]
    };
    const operator = {
      name: "OPERATOR",
      description: "OPERATOR",
      // accessControlList: _.sampleSize(enumToArray(AccessControlList), 4)
    };
    const sale = {
      name: "SALE",
      description: "SALE",
      // accessControlList: _.sampleSize(enumToArray(AccessControlList), 2)
    };
    const intern = {
      name: "INTERN",
      description: "INTERN",
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
