import { EntityRepository } from "typeorm";
import { TreeBaseRepository } from "@src/app/Common/TreeBase/Repository/index.repository";
import { MyTreeExample } from "../myTreeExample.entity";

@EntityRepository(MyTreeExample)
export class MyTreeExampleRepository extends TreeBaseRepository<
  MyTreeExample
> {}
