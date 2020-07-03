import { getManager, TreeRepository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import * as _ from "lodash";

export class TreeBaseRepository<T> extends TreeRepository<T> {
  entityName = _.replace(this.constructor.name, "Repository", "");

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

  async findRawOneByIdOrFail(id: number): Promise<any> {
    const manager = getManager();
    const rawData = await manager.query(
      `SELECT * FROM ${this.metadata.givenTableName} where id = ${id}`
    );
    if (_.isEmpty(rawData)) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
    return rawData[0];
  }

  async findRawParentByParentId(parentId: number): Promise<any> {
    const manager = getManager();
    if (!parentId) {
      return {};
    }
    const rawData = await manager.query(
      `SELECT * FROM ${this.metadata.givenTableName} where id = ${parentId}`
    );
    if (_.isEmpty(rawData)) return {};
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
