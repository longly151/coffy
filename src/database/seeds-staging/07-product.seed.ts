/* eslint-disable @typescript-eslint/no-unused-vars */
import { Seeder, Factory } from 'typeorm-seeding';
import { resolve } from 'path';
import { convertCsvToJson, insertDbData } from '../../core/utils/appHelper';

export default class CreateProducts implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const table = 'products';
    const fields = ['id', 'title', 'description', 'thumbnail', 'slug', 'categoryId', 'price', 'content'];
    const numberTypeFields = ['id'];
    const nullableFields = [];
    const filepath = resolve(__dirname, 'data', 'product.csv');
    const fetchData = await convertCsvToJson(filepath);
    await insertDbData(table, fields, numberTypeFields, nullableFields, fetchData);
  }
}
