import {
  Controller,
  UseGuards,
  Get,
  ValidationPipe,
  Query,
  ParseIntPipe,
  Param,
  Post,
  UsePipes,
  Body,
  Patch,
  Delete,
  Type,
  ConflictException,
  InternalServerErrorException,
  UseInterceptors,
  NotFoundException,
} from "@nestjs/common";
import {
  Crud,
  Override,
  CrudController,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
} from "@nestjsx/crud";
import { BaseController } from "@src/app/Common/Base/Controller/index.controller";
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { RolesGuard } from "@src/common/guards/roles.guard";
import { ACL } from "@src/common/decorators/acl.decorator";
import { AccessControlList } from "@src/common/enums/accessControlList";
import * as _ from "lodash";
import { AuthorFilterInterceptor } from "@src/common/interceptors/request.interceptor";
import { CurrentUser } from "@src/common/decorators/currentUser.decorator";
import { intersectPermission } from "@src/core/utils/appHelper";
import { UseCrud } from "@src/common/decorators/crud.decorator";
import { UserService } from "../Service/index.service";
import { User } from "../user.entity";
import { UserRepository } from "../Repository/index.repository";
import { JwtAuthGuard } from "../../Auth/Guards/jwt-auth.guard";

@UseCrud(User, {
  routes: {
    exclude: ["getOneBase", "deleteOneBase"],
  },
  query: {
    exclude: ["password"],
    join: {
      role: {
        allow: ["name"],
        eager: true,
      },
      "role.permissions": {
        eager: true,
      },
    },
  },
})
@ApiTags("users")
@Controller("users")
export class UserController extends BaseController<User> {
  constructor(
    public service: UserService,
    private readonly repository: UserRepository
  ) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */

  @ACL(AccessControlList.DEFAULT)
  @Override("createOneBase")
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
    try {
      const result = await this.base.createOneBase(req, dto);
      return result;
    } catch (error) {
      if (error.code === "23505") {
        // console.log('error', error.detail);
        // const key = _.upperFirst(_.words(error.detail)[1]);
        // console.log('key', key);
        throw new ConflictException("Email already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @ACL(AccessControlList.DEFAULT)
  @Override("updateOneBase")
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
    try {
      const result = await this.base.updateOneBase(req, dto);
      return result;
    } catch (error) {
      console.log("error", error);

      if (error.code === "23505") {
        throw new ConflictException("Email already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @ACL(AccessControlList.DEFAULT)
  @Override("createManyBase")
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<User>
  ) {
    try {
      const result = await this.base.createManyBase(req, dto);
      return result;
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Email already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

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
  async GetOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ): Promise<User> {
    try {
      let result = await this.repository.findOneOrFail(id);
      if (this.handleSelfPermissionOrFail("READ", result, user)) {
        // Remove password field
        if (_.has(result, "password")) {
          result = _.omit(result, ["password"]);
        }
        return result;
      }
      return null;
    } catch (error) {
      console.log("error", error);

      throw new InternalServerErrorException();
    }
  }
}
