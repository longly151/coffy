/* eslint-disable @typescript-eslint/no-unused-vars */
import { Seeder, Factory } from 'typeorm-seeding';
import { resolve } from 'path';
import { convertCsvToJson, insertDbData } from '../../core/utils/appHelper';

export default class CreateProductBills implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const table = 'product_bills';
    const fields = ['billId', 'productId', 'quantity', 'pricePerUnit'];
    const numberTypeFields = ['billId', 'productId', 'quantity', 'pricePerUnit'];
    const nullableFields = [];
    const filepath = resolve(__dirname, 'data', 'productBill.csv');
    const fetchData = await convertCsvToJson(filepath);
    await insertDbData(table, fields, numberTypeFields, nullableFields, fetchData);
  }
}
