import { EntityRepository, getManager } from "typeorm";
import { TreeBaseRepository } from "@src/app/Common/TreeBase/Repository/index.repository";
import { ServiceCategory } from "../serviceCategory.entity";

@EntityRepository(ServiceCategory)
export class ServiceCategoryRepository extends TreeBaseRepository<
  ServiceCategory
> {}
