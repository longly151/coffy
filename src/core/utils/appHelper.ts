/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
import _ from 'lodash';
import { getManager, getConnection } from 'typeorm';
import { Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import csv from 'csv-parser';
import fs from 'fs';
import { createSlugWithDateTime, createSlug } from './helper';

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
      .pipe(csv({
        mapHeaders: ({ header }) => header.replace(/"/g, '')
      }))
      .on('data', (row) => {
        const data:any = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const property in row) {
          if (Object.prototype.hasOwnProperty.call(row, property)) {
            const propertyString: string = property.toString().trim();
            data[propertyString] = row[property];
          }
        }
        fetchData.push(data);
      })
      .on('end', () => {
        resolve(fetchData);
      })
      .on('error', reject);
  });
  return fetchData;
}

async function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

export async function insertDbData(table: string, fields: Array<string>, numberTypeFields: Array<string>, nullableFields: Array<string>, values: Array<any>) {
  /**
   * Handle Nullable & Number Values
   */
  const handledValues = values;
  handledValues.forEach((val, index) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const property in val) {
      if (Object.prototype.hasOwnProperty.call(val, property)) {
        if(_.includes(nullableFields, property)) {
          if(handledValues[index][property] === ''){
            handledValues[index][property] = null;
          }
        }
        if(_.includes(numberTypeFields, property)) {
          if (val[property] !== null && val[property] !== '') {
            handledValues[index][property] = parseInt(val[property], 10);
          }
        }
      }
    }
    // Handle Null Slug
    if(_.includes(fields, 'slug')){
      if(!val['slug']) {
        if (_.includes(fields, 'title')) {
          handledValues[index]['slug'] = createSlugWithDateTime(handledValues[index]['title']);
        } else if (_.includes(fields, 'name')) {
          handledValues[index]['slug'] = createSlug(handledValues[index]['name']);
        }
      }
    }
    if(_.includes(fields, 'viSlug')){
      if(!val['viSlug']) {
        if (_.includes(fields, 'viTitle')) {
          handledValues[index]['viSlug'] = createSlugWithDateTime(handledValues[index]['viTitle']);
        } else if (_.includes(fields, 'viName')) {
          handledValues[index]['viSlug'] = createSlug(handledValues[index]['viName']);
        }
      }
    }
  });


  /**
   * ** RAW QUERY **
   * Add query params & Insert data to Database
   */
  // Header (Query Form)
  // const manager = getManager();
  // const handledFields = [...fields];
  // const handledFieldsIndex = [];
  // fields.forEach((val, index) => {
  //   // createdAt => "createdAt"
  //   handledFields[index] = `"${val}"`;
  //   // 1 => $1
  //   handledFieldsIndex.push(`$${index + 1}`);
  // });
  // const queryField = _.join(handledFields, ',');
  // const queryIndex = _.join(handledFieldsIndex, ',');
  // const query = `INSERT INTO public.${table}(${queryField}) VALUES (${queryIndex})`;

  // Params
  // await Promise.all(handledValues.map(async (val) => {
  //   const valueArray = [];
  //   fields.forEach((field: string) => {
  //     valueArray.push(val[field]);
  //   });
  //   await manager.query(query, valueArray);
  // }));

  /**
   * ** QUERY BUILDER **
   * Add query params & Insert data to Database
   */

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(table)
    .values(handledValues)
    .execute();


  return true;
}

export function slugifyInsert(obj: any) {
  if(!obj.slug){
    if (_.has(obj, 'title')) obj.slug = createSlugWithDateTime(obj['title']);
    if (_.has(obj, 'name')) obj.slug = createSlug(obj['name']);
  }
  if(!obj.viSlug){
    if (_.has(obj, 'viTitle')) obj.viSlug = createSlugWithDateTime(obj['viTitle']);
    if (_.has(obj, 'viName')) obj.viSlug = createSlug(obj['viName']);
  }
}

export async function slugifyUpdate(obj: any, objClass: any) {
  const repository = await objClass.getRepository();
  const dbObject = await repository.findOne(obj.id);
  if(dbObject) {
    if (obj.slug && obj.slug === dbObject.slug) {

      const dbName = dbObject['title'] || dbObject['name'];
      const dbSlug = dbObject.slug;
      const objName = obj['title'] || obj['name'];

      if (objName !== dbName) {
      // check if slug is created automatically
        if (_.includes(dbSlug, createSlug(dbName))) {
          if (_.has(obj, 'title')) obj.slug = createSlugWithDateTime(obj['title']);
          if (_.has(obj, 'name')) obj.slug = createSlug(obj['name']);
        }
      }
    }
  }
}

export async function handleManyToMany(obj: any, idNames: string, refObjectNames: string, refObjClass: any) {
  const repository = await refObjClass.getRepository();
  const ids = obj[idNames] || [];
  const dbObject = await repository.findByIds(ids);

  obj[refObjectNames] = dbObject;
}
