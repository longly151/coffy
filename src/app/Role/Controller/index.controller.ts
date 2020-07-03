import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { BaseController } from "@src/app/Common/Base/Controller/index.controller";
import { UseCrud } from "@src/common/decorators/crud.decorator";
import { CurrentUser } from "@src/common/decorators/currentUser.decorator";
import { AccessControlList } from "@src/common/enums/accessControlList";
import { ACL } from "@src/common/decorators/acl.decorator";
import {
  Override,
  ParsedRequest,
  ParsedBody,
  CrudRequest,
} from "@nestjsx/crud";
import { UserRepository } from "@src/app/User/Repository/index.repository";
import { RoleRepository } from "../Repository/index.repository";
import { RoleService } from "../Service/index.service";
import { Role } from "../role.entity";

@UseCrud(Role, {
  query: {
    join: {
      permissions: {
        allow: ["name"],
        eager: true,
      },
    },
  },
})
@ApiTags("roles")
@Controller("roles")
export class RoleController extends BaseController<Role> {
  constructor(
    public service: RoleService,
    private readonly repository: RoleRepository,
    private readonly userRepository: UserRepository
  ) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */

  /**
   * GET TRASH
   * @param user CurrentUser
   */
  @Get("trashed")
  @ACL(AccessControlList.DEFAULT)
  @ApiOperation({ summary: "Get deleted Record" })
  async getOverrideTrashed(@CurrentUser() user: any): Promise<any> {
    return this.getTrashed(user);
  }

  /**
   * GET ONE
   * @param id Param
   * @param user CurrentUser
   */
  @ApiOperation({ summary: "Get one Record" })
  @ACL(AccessControlList.DEFAULT)
  @Override("getOneBase")
  @Get(":id")
  async GetOne(@Param("id", ParseIntPipe) id: number): Promise<Role> {
    return this.GetOneBase(id);
  }

  /**
   * CREATE ONE
   * @param req CrudRequest
   * @param dto Destination
   */
  @ACL(AccessControlList.DEFAULT)
  @Override("createOneBase")
  async createOne(@ParsedBody() dto: Role) {
    const dbObject = new Role();
    return this.service.saveObject(dbObject, dto);
  }

  /**
   * UPDATE ONE
   * @param dto Role
   * @param id Param
   */
  @ACL(AccessControlList.DEFAULT)
  @Override("updateOneBase")
  async updateOne(
    @ParsedBody() dto: Role,
    @Param("id", ParseIntPipe) id: number
  ) {
    if (id === 1) {
      throw new BadRequestException("Cannot update ADMIN Role");
    }
    const dbObject = await this.repository.findOne(id);
    return this.service.saveObject(dbObject, dto);
  }
}
