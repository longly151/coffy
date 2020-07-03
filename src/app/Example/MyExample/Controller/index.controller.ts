import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { BaseController } from "@src/app/Common/Base/Controller/index.controller";
import { UseCrud } from "@src/common/decorators/crud.decorator";
import { ACL } from "@src/common/decorators/acl.decorator";
import { AccessControlList } from "@src/common/enums/accessControlList";
import { CurrentUser } from "@src/common/decorators/currentUser.decorator";
import { Override } from "@nestjsx/crud";
import { MyExampleRepository } from "../Repository/index.repository";
import { MyExampleService } from "../Service/index.service";
import { MyExample } from "../myExample.entity";

@UseCrud(MyExample, {
  routes: {
    exclude: ["getOneBase", "deleteOneBase"],
  },
})
@ApiTags("my_examples")
@Controller("my_examples")
export class MyExampleController extends BaseController<MyExample> {
  constructor(
    public service: MyExampleService,
    private readonly repository: MyExampleRepository
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
  async GetOne(@Param("id", ParseIntPipe) id: number): Promise<MyExample> {
    return this.GetOneBase(id);
  }
}
