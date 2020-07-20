import { Seeder, Factory } from 'typeorm-seeding';
import { getConnection, Connection } from 'typeorm';
import { Category } from '../../app/Category/index.entity';
import { Post } from '../../app/Post/index.entity';

export default class CreatePosts implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const connection: Connection = getConnection();
    const repository = connection.getRepository(Category);
    const categoryLength = await repository.count();

    await factory(Post)({ categoryLength }).createMany(15);
  }
}
