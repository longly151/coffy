import _ from 'lodash';
import { getManager } from 'typeorm';
import { Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import csv from 'csv-parser';
import fs from 'fs';

interface IPermission {
  id: number;
  name: string;
  description?: string | null;
}
export const intersectPermission = (
  userPermission: Array<string>,
  requiredPermission: Array<string> | string
): boolean => {
  let arrayRequiredPermission: any = [];
  if (!_.isArray(requiredPermission))
    arrayRequiredPermission = [requiredPermission];
  else arrayRequiredPermission = requiredPermission;
  if (!_.isEmpty(_.intersection(userPermission, arrayRequiredPermission))) {
    return true;
  }
  return false;
};

export function extractEntity(root: string) {
  return _.replace(root, /Controller/gi, '')
    .replace(/Service/gi, '')
    .replace(/Repository/gi, '');
}

export function extractTableName(root: string) {
  let entity = _.replace(root, /Controller/gi, '')
    .replace(/Service/gi, '')
    .replace(/Repository/gi, '');
  entity = _.toLower(entity);
  return `${entity}s`;
}

export async function getRepository(entity: any) {
  const manager = getManager();
  return manager.getRepository(entity);
}

export async function getClientError(metatype: Type<any>, value: any) {
  const object = plainToClass(metatype, value);

  const errors = await validate(object);
  const returnError = [];
  if (_.has(value, 'bulk')) {
    // Multiple create
    if (!_.isEmpty(errors)) {
      const singleItemErrors = errors[0].children[0].children;
      singleItemErrors.map((error: any) => {
        returnError.push(_.pick(error, ['constraints', 'property']));
        return true;
      });
    }
  } else {
    // Single create
    errors.map((error: any) => {
      returnError.push(_.pick(error, ['constraints', 'property']));
      return true;
    });
  }
  if (errors.length > 0) {
    return returnError;
  }
  return null;
}

export function extractExistedKey(detail: string): string {
  let result: any = _.split(detail, ')=', 1);
  result = _.split(result, '(', 2);
  return result[1];
}

export async function convertCsvToJson(filepath: string){
  const fetchData = [];
  await new Promise((resolve, reject)=>{
    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', (row) => {
        fetchData.push(row);
      })
      .on('end', () => {
        resolve(fetchData);
      })
      .on('error', reject);
  });
  return fetchData;
}

export async function insertDbData(table: string, fields: Array<string>, numberTypeFields: Array<string>, nullableFields: Array<string>, values: Array<any>) {
  const manager = getManager();
  /**
   * Handle queryForm
   */
  const handleFields = [...fields];
  const handleFieldsIndex = [];
  fields.forEach((val, index) => {
    // createdAt => "createdAt"
    handleFields[index] = `"${val}"`;
    // 1 => $1
    handleFieldsIndex.push(`$${index + 1}`);
  });
  const queryField = _.join(handleFields, ',');
  const queryIndex = _.join(handleFieldsIndex, ',');

  const query = `INSERT INTO public.${table}(${queryField}) VALUES (${queryIndex})`;

  /**
   * Handle Nullable & Number Values
   */
  const handleValues = values;
  handleValues.forEach((val, index) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const property in val) {
      if (Object.prototype.hasOwnProperty.call(val, property)) {
        if(_.includes(nullableFields, property)) {
          if(handleValues[index][property] === ''){
            handleValues[index][property] = null;
          }
        }
        if(_.includes(numberTypeFields, property)) {
          if (val[property] !== null && val[property] !== '') {
            handleValues[index][property] = parseInt(val[property], 10);
          }
        }
      }
    }
  });

  /**
   * Add query params & Insert data to Database
   */
  let valueArray = [];

  // console.log('handleValues1', handleValues);

  if (_.includes(fields, 'parentItemId')) {
    await Promise.all(handleValues.map(async (val) => {
      valueArray = [];
      fields.forEach((field: string) => {
        valueArray.push(val[field]);
      });
      if(val.parentItemId === null)
        await manager.query(query, valueArray);
    }));
    await Promise.all(handleValues.map(async (val) => {
      valueArray = [];
      fields.forEach((field: string) => {
        valueArray.push(val[field]);
      });
      if(val.parentItemId !== null)
        await manager.query(query, valueArray);
    }));
  }
  else {
    await Promise.all(handleValues.map(async (val) => {
      valueArray = [];
      fields.forEach((field: string) => {
        valueArray.push(val[field]);
      });
      await manager.query(query, valueArray);
    }));
  }
  return true;
}
