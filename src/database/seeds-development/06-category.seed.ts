import { Seeder, Factory } from 'typeorm-seeding';
import { Connection, getConnection } from 'typeorm';
import * as _ from 'lodash';
import { TreeLevel } from '../enum/tree.enum';
import { Category } from '../../app/Category/index.entity';

export default class CreateCategories implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const connection: Connection = getConnection();
    const serviceRepository = connection.getTreeRepository(Category);

    /**
     * Root
     */
    await factory(Category)({ type: TreeLevel.ROOT }).createMany(5);

    /**
     * Node
     */
    const roots = await serviceRepository.findRoots();
    await factory(Category)({
      type: TreeLevel.NODE,
      parents: roots
    }).createMany(5);

    /**
     * SubNode
     */
    const descendants = await roots.map(async (element) => {
      const des = await serviceRepository.findDescendants(element);
      return des;
    });
    const finalDescendants = _.flatten(await Promise.all(descendants));
    await factory(Category)({
      type: TreeLevel.NODE,
      parents: finalDescendants
    }).createMany(5);
  }
}
