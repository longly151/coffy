import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleController } from "./Controller/index.controller";
import { RoleService } from "./Service/index.service";
import { RoleRepository } from "./Repository/index.repository";
import { UserRepository } from "../User/Repository/index.repository";
import { PermissionRepository } from "../Permission/Repository/index.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleRepository,
      PermissionRepository,
      UserRepository,
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
