import { EntityRepository, getManager } from "typeorm";
import { TreeBaseRepository } from "@src/app/Common/TreeBase/Repository/index.repository";
import { Destination } from "../destination.entity";

@EntityRepository(Destination)
export class DestinationRepository extends TreeBaseRepository<Destination> {}
