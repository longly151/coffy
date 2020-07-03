import * as _ from "lodash";
import { getManager } from "typeorm";
import { getValueOfKeyFromCollection } from "./helper";

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
  return _.replace(root, /Controller/gi, "")
    .replace(root, /Service/gi, "")
    .replace(root, /Repository/gi, "");
}

export async function getRepository(entity: any) {
  const manager = getManager();
  return manager.getRepository(entity);
}
