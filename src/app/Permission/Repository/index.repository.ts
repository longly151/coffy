import { EntityRepository } from "typeorm";
import { BaseRepository } from "@src/app/Common/Base/Repository/index.repository";
import { Permission } from "../permission.entity";

@EntityRepository(Permission)
export class PermissionRepository extends BaseRepository<Permission> {}
