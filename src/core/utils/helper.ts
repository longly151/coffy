import * as _ from "lodash";

// const slug = require('slug');
import * as slug from "slug";

export function enumToArray(enumme) {
  return Object.keys(enumme).map((key) => enumme[key]);
}

export const countChar = (str, char): number => _.countBy(str)[char] || 0;

export const equalNumber = (data: any): boolean =>
  _.isNumber(data) || !_.isNaN(_.parseInt(data));

export const getValueOfKeyFromCollection = (
  data: any,
  key: string
): Array<string> => _.map(data, key);

export const getFieldsFromCollection = (
  data: any,
  fields: string[]
): Array<object> => _.map(data, _.partialRight(_.pick, fields));

/* eslint-disable */

const getObject = (theObject: any, fields: string[], nestedField: string) => {
  let result = null;
  if (theObject instanceof Array) {
    for (let i = 0; i < theObject.length; i++) {
      result = getObject(theObject[i], fields, nestedField);
    }
  } else {
    for (const prop in theObject) {
      if (prop == nestedField) {
        theObject[prop] = _.map(
          theObject[prop],
          _.partialRight(_.pick, fields)
        );
      }
      if (theObject[prop] instanceof Object || theObject[prop] instanceof Array)
        result = getObject(theObject[prop], fields, nestedField);
    }
  }
  return result;
};

export const getDeepFieldsFromCollection = (
  data: any,
  fields: string[],
  nestedField: string
) => {
  getObject(data, fields, nestedField);
  return getFieldsFromCollection(data, fields);
};

export const createSlug = (data: string) => slug(data, { locale: "vi" });
