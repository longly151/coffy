import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { BaseController } from "@src/app/Common/Base/Controller/index.controller";
import { UseCrud } from "@src/common/decorators/crud.decorator";
import { ACL } from "@src/common/decorators/acl.decorator";
import { AccessControlList } from "@src/common/enums/accessControlList";
import { CurrentUser } from "@src/common/decorators/currentUser.decorator";
import { Override } from "@nestjsx/crud";
import { CredentialRepository } from "../Repository/index.repository";
import { CredentialService } from "../Service/index.service";
import { Credential } from "../credential.entity";

@UseCrud(Credential, {
  routes: {
    exclude: ["getOneBase", "deleteOneBase"],
  },
})
@ApiTags("credentials")
@Controller("credentials")
export class CredentialController extends BaseController<Credential> {
  constructor(
    public service: CredentialService,
    private readonly repository: CredentialRepository
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
  async GetOne(@Param("id", ParseIntPipe) id: number): Promise<Credential> {
    return this.GetOneBase(id);
  }
}
