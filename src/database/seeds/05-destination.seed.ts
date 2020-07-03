import { Seeder, Factory } from "typeorm-seeding";
import { Connection, getConnection } from "typeorm";
import * as _ from "lodash";
import { TreeLevel } from "../enum/tree.enum";
import { Destination } from "../../app/Destination/destination.entity";

export default class CreateDestinations implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const connection: Connection = getConnection();
    const destinationRepository = connection.getTreeRepository(Destination);

    /**
     * Root
     */
    await factory(Destination)({ type: TreeLevel.ROOT }).createMany(5);

    /**
     * Node
     */
    const roots = await destinationRepository.findRoots();
    await factory(Destination)({
      type: TreeLevel.NODE,
      parents: roots,
    }).createMany(5);

    /**
     * SubNode
     */
    const descendants = await roots.map(async (element) => {
      const des = await destinationRepository.findDescendants(element);
      return des;
    });
    const finalDescendants = _.flatten(await Promise.all(descendants));
    await factory(Destination)({
      type: TreeLevel.NODE,
      parents: finalDescendants,
    }).createMany(5);
  }
}
