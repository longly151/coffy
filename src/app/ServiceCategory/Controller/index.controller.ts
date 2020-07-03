import {
  Controller,
  UseGuards,
  InternalServerErrorException,
  Get,
  Param,
  NotFoundException,
  Delete,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import {
  Crud,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
} from "@nestjsx/crud";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBasicAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/app/Auth/Guards/jwt-auth.guard";
import { UseCrud } from "@src/common/decorators/crud.decorator";
import { AccessControlList } from "@src/common/enums/accessControlList";
import { ACL } from "@src/common/decorators/acl.decorator";
import {
  getFieldsFromCollection,
  getDeepFieldsFromCollection,
  getValueOfKeyFromCollection,
} from "@src/core/utils/helper";
import { CurrentUser } from "@src/common/decorators/currentUser.decorator";
import * as _ from "lodash";
import { getManager } from "typeorm";
import { TreeBaseController } from "@src/app/Common/TreeBase/Controller/index.controller";
import { ServiceCategory } from "../serviceCategory.entity";
import { ServiceCategoryService } from "../Service/index.service";
import { ServiceCategoryRepository } from "../Repository/index.repository";

@UseCrud(ServiceCategory, {
  routes: {
    exclude: ["getManyBase", "getOneBase", "replaceOneBase", "deleteOneBase"],
  },
})
@ApiTags("service_categories")
@Controller("service_categories")
export class ServiceCategoryController extends TreeBaseController<
  ServiceCategory
> {
  constructor(
    public service: ServiceCategoryService,
    private readonly repository: ServiceCategoryRepository
  ) {
    super(repository);
  }

  /**
   * GET MANY
   * @param req CrudRequest
   */
  @Get()
  @ApiOperation({ summary: "Retrieve many ServiceCategory" })
  async getMany() {
    // Find Tree
    const data = await this.repository.findTrees();
    // Get specific fields
    return getDeepFieldsFromCollection(
      data,
      ["id", "name", "slug", "childrenItems"],
      "childrenItems"
    );
  }

  /**
   * GET ROOTS
   * @param req CrudRequest
   */
  @Get("roots")
  @ApiOperation({ summary: "Retrieve many Root ServiceCategory" })
  async getManyRoot() {
    return this.service.getManyRoot();
  }

  /**
   * GET CHILDREN
   * @param req CrudRequest
   */
  @ApiOperation({ summary: "Retrieve many Children ServiceCategory" })
  @Get(":id/children")
  async getChildren(
    @Param("id", new ParseIntPipe())
    id: number
  ) {
    return this.service.getChildren(id);
  }

  /**
   * GET PARENT
   * @param req CrudRequest
   */
  @ApiOperation({ summary: "Retrieve One Parent ServiceCategory" })
  @Get(":id/parents")
  async getParent(
    @Param("id", new ParseIntPipe())
    id: number
  ) {
    return this.service.getParent(id);
  }

  /**
   * CREATE ONE
   * @param req CrudRequest
   * @param dto ServiceCategory
   */
  @ACL(AccessControlList.DEFAULT)
  @Override("createOneBase")
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ServiceCategory
  ) {
    const dbObject = new ServiceCategory();
    return this.service.saveObject(dbObject, dto);
  }

  /**
   * CREATE MANY
   * @param req CrudRequest
   * @param dto ServiceCategory
   */
  @Override("createManyBase")
  @ACL(AccessControlList.DEFAULT)
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<ServiceCategory>
  ) {
    const result = await Promise.all(
      dto.bulk.map(async (e: any) => {
        const dbObject = new ServiceCategory();
        const callbackResult = await this.service.saveObject(dbObject, e);
        return callbackResult;
      })
    );
    return result;
  }

  /**
   * UPDATE ONE
   * @param dto UpdateServiceCategoryDto
   * @param param
   */
  @Override("updateOneBase")
  @ACL(AccessControlList.DEFAULT)
  async updateOne(@ParsedBody() dto: ServiceCategory, @Param() param) {
    const dbObject = await this.repository.findOneByIdOrFail(param.id);
    if (dto.parentId) {
      throw new BadRequestException([
        {
          constraints: {
            isEmpty: "parentId must be empty",
          },
          property: "parentId",
        },
      ]);
    }
    return this.service.saveObject(dbObject, dto);
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
   * GET ONE BY SLUG
   * @param slug Param
   * @param user CurrentUser
   */
  @ApiOperation({ summary: "Get one Record by Slug" })
  @Get(":slug")
  async GetOneBySlug(@Param("slug") slug: string): Promise<ServiceCategory> {
    return this.GetOneBaseBySlug(slug);
  }

  /**
   * GET ONE
   * @param id Param
   * @param user CurrentUser
   */
  @ApiOperation({ summary: "Get one Record" })
  @Override("getOneBase")
  @Get(":id")
  async GetOne(
    @Param("id", ParseIntPipe) id: number
  ): Promise<ServiceCategory> {
    return this.GetOneBase(id);
  }
}
