import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { PermissionRepository } from "@src/app/Permission/Repository/index.repository";
import { UserRepository } from "@src/app/User/Repository/index.repository";
import { RoleRepository } from "../Repository/index.repository";
import { Role } from "../role.entity";

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role) repo,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository
  ) {
    super(repo);
  }

  async saveObject(paramObject: Role, dto: Role) {
    const dbObject = paramObject;
    dbObject.name = dto.name;
    dbObject.description = dto.description;

    // Update Permission
    dbObject.permissions = await this.permissionRepository.findByIds(
      dto.permissionIds
    );

    // Set hasExpiredToken of Users which have current Role into TRUE
    const affectedUsers = await this.userRepository.find({
      roleId: dbObject.id,
    });
    await Promise.all(
      affectedUsers.map((element) => {
        const affectedUser = element;
        affectedUser.hasExpiredToken = true;
        return this.userRepository.save(affectedUser);
      })
    );

    // Save
    const result = await this.roleRepository.save(dbObject);
    return result;
  }
}
