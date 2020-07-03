import { EntityRepository } from "typeorm";
import { User } from "../user.entity";
import { BaseRepository } from "../../Common/Base/Repository/index.repository";

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  async findOneByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }
}
