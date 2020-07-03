import { Seeder, Factory } from "typeorm-seeding";
import { getConnection } from "typeorm";
import { User } from "../../app/User/user.entity";
import Bcrypt from "../../plugins/bcrypt.plugin";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    // Hash password
    const hashPass: string = await Bcrypt.hash("admin");
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          fullName: "Admin",
          email: "admin@gmail.com",
          password: hashPass,
          phone: "0327571918",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU",
          gender: "MALE",
          birthday: "1999/12/31",
          bio: "I'm admin",
          note: "Nothing",
          status: "ACTIVE",
          roleId: 1,
        },
      ])
      .execute();
    await factory(User)({ roles: ["MEMBER"] }).createMany(10);
  }
}
