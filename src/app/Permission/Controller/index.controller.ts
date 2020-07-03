import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UseCrud } from "@src/common/decorators/crud.decorator";
import { CrudController } from "@nestjsx/crud";
import { PermissionRepository } from "../Repository/index.repository";
import { PermissionService } from "../Service/index.service";
import { Permission } from "../permission.entity";

@UseCrud(Permission, {
  routes: {
    only: ["getManyBase"],
  },
})
@ApiTags("permissions")
@Controller("permissions")
export class PermissionController implements CrudController<Permission> {
  constructor(
    public service: PermissionService,
    private readonly repository: PermissionRepository
  ) {}
}
