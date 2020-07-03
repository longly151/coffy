import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { UserRepository } from "../Repository/index.repository";
import { User } from "../user.entity";

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repo,
    private readonly userRepository: UserRepository
  ) {
    super(repo);
  }
}
