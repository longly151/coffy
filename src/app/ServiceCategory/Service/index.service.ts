import {
  Injectable,
  Param,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import * as _ from "lodash";
import { getValueOfKeyFromCollection } from "@src/core/utils/helper";
import { ServiceCategory } from "../serviceCategory.entity";
import { ServiceCategoryRepository } from "../Repository/index.repository";

@Injectable()
export class ServiceCategoryService extends TypeOrmCrudService<
  ServiceCategory
> {
  constructor(
    @InjectRepository(ServiceCategory) repo,
    private readonly repository: ServiceCategoryRepository
  ) {
    super(repo);
  }

  /**
   * Common functions
   */

  async saveObject(paramObject: ServiceCategory, dto: ServiceCategory) {
    const dbObject = paramObject;
    dbObject.name = dto.name;
    dbObject.slug = dto.slug;
    dbObject.description = dto.description;
    dbObject.content = dto.content;
    dbObject.thumbnail = dto.thumbnail;

    // Find Parent
    if (dto.parentId) {
      const parentDbObject = await this.repository.findOne(dto.parentId);
      if (parentDbObject) {
        dbObject.parentItem = parentDbObject;
      } else {
        throw new BadRequestException([
          {
            constraints: {
              isForeignKey: "parentId must be an existed foreign key",
            },
            property: "parentId",
          },
        ]);
      }
    }

    // Save
    const result = await this.repository.save(dbObject);
    return result;
  }

  async getManyRoot() {
    return this.repository.findRoots();
  }

  async getChildren(id: number) {
    const dbObject = await this.repository.findOneByIdOrFail(id);
    const allDescendants = _.filter(
      await this.repository.findDescendants(dbObject),
      (o: any) => o.id !== dbObject.id
    );

    // Find Ids of descendants which have nested descendants
    const middleDescendantsIds = _.flatten(
      _.compact(
        await Promise.all(
          allDescendants.map(async (e: any) => {
            if (e.id !== dbObject.id) {
              const subDescendants = _.filter(
                await this.repository.findDescendants(e),
                (o: any) => o.id !== e.id
              );
              if (!_.isEmpty(subDescendants))
                return getValueOfKeyFromCollection(subDescendants, "id");
              return null;
            }
            return null;
          })
        )
      )
    );

    // Descendants returning to Client
    const finalDescendants = _.filter(
      allDescendants,
      (o: any) => !_.includes(middleDescendantsIds, o.id)
    );
    return finalDescendants;
  }

  async getParent(id: number) {
    const dbObject = await this.repository.findRawOneByIdOrFail(id);
    const parents = await this.repository.findRawParentByParentId(
      dbObject.parentItemId
    );
    return _.omit(parents, ["mpath", "parentId"]);
  }
}
