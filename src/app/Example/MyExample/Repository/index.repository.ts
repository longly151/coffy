import { EntityRepository } from "typeorm";
import { BaseRepository } from "@src/app/Common/Base/Repository/index.repository";
import { MyExample } from "../myExample.entity";

@EntityRepository(MyExample)
export class MyExampleRepository extends BaseRepository<MyExample> {}
