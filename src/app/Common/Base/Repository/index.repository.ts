import { Repository, getManager } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import _ from 'lodash';

export class BaseRepository<T> extends Repository<T> {
  entityName = _.replace(this.constructor.name, 'Repository', '');

  async findOneByIdOrFail(id: number): Promise<T> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
    return found;
  }

  async findOneBySlugOrFail(slug: string): Promise<T> {
    const found = await this.findOne({ where: { slug } });
    if (!found) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
    return found;
  }

  async findRawOneByIdOrFail(id: number): Promise<T> {
    const manager = getManager();
    const rawData = await manager.query(
      `SELECT * FROM ${this.metadata.givenTableName} where id = ${id}`
    );
    if (_.isEmpty(rawData)) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
    return rawData[0];
  }

  async getManyWithTrashed(): Promise<Array<T>> {
    const manager = getManager();
    const rawData = await manager.query(
      `SELECT * FROM ${this.metadata.givenTableName} where "deletedAt" is not null`
    );
    return rawData;
  }

  async getManyWithSelfTrashed(
    userId: number,
    idField: string
  ): Promise<Array<T>> {
    const manager = getManager();
    const rawData = await manager.query(
      `SELECT * FROM ${this.metadata.givenTableName} where "deletedAt" is not null and ${idField}=${userId}`
    );
    return rawData;
  }

  async getOneByIdWithTrashed(id: number): Promise<T> {
    const manager = getManager();
    const rawData = await manager.query(
      `SELECT * FROM ${this.metadata.givenTableName} where id = ${id} and "deletedAt" is not null`
    );
    return rawData;
  }
}
