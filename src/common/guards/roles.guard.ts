import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { countChar, equalNumber } from "@src/core/utils/helper";
import * as _ from "lodash";
import { extractEntity } from "@src/core/utils/appHelper";
import { AccessControlList } from "../enums/accessControlList";

type TMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  getPermissionNames(
    upperEntityName: string,
    method: TMethod,
    url: string
  ): Array<string> {
    let permissionNames: Array<string> = [];
    const slashCount = countChar(url, "/");
    const lastParam = url.split("/").pop();
    let checkUrl = false;
    if (slashCount === 2) checkUrl = true;
    if (
      slashCount === 3 &&
      (equalNumber(lastParam) || _.includes(["trashed", "bulk"], lastParam))
    )
      checkUrl = true;
    if (
      slashCount === 4 &&
      (equalNumber(lastParam) ||
        _.includes(["permanently", "restore"], lastParam))
    )
      checkUrl = true;

    if (checkUrl) {
      switch (method) {
        case "GET":
          permissionNames.push(
            `${upperEntityName}_READ`,
            `SELF_${upperEntityName}_READ`
          );
          break;
        case "POST":
          permissionNames.push(
            `${upperEntityName}_CREATE`,
            `SELF_${upperEntityName}_CREATE`
          );
          break;
        case "PUT":
        case "PATCH":
          if (lastParam === "restore") {
            permissionNames.push(
              `${upperEntityName}_DELETE`,
              `SELF_${upperEntityName}_DELETE`
            );
          } else {
            permissionNames.push(
              `${upperEntityName}_UPDATE`,
              `SELF_${upperEntityName}_UPDATE`
            );
          }
          break;
        case "DELETE":
          if (lastParam === "permanently") {
            permissionNames.push(
              `${upperEntityName}_PERMANENTLY_DELETE`,
              `SELF_${upperEntityName}_PERMANENTLY_DELETE`
            );
          } else {
            permissionNames.push(
              `${upperEntityName}_DELETE`,
              `SELF_${upperEntityName}_DELETE`
            );
          }
          break;
        default:
          permissionNames = [];
      }
    }
    return permissionNames;
  }

  checkPermission(
    currentUserPermission: Array<string>,
    permissionNames: Array<string>
  ): boolean {
    // Admin Permission
    if (_.includes(currentUserPermission, AccessControlList.ALL)) {
      return true;
    }
    // Other Permissions
    if (!_.isEmpty(_.intersection(currentUserPermission, permissionNames))) {
      return true;
    }
    return false;
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("ACLs", context.getHandler());
    if (!roles) {
      return true;
    }
    // Get Current User's Permission
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const currentUserPermission = user.permissions;

    // Get PermissionNames
    let permissionNames = [];
    if (_.isEqual(roles, [AccessControlList.DEFAULT])) {
      const upperEntityName = _.toUpper(extractEntity(context.getClass().name));
      const {
        route: { path },
      } = context.getArgByIndex(1).req;
      const { method } = context.getArgByIndex(1).req;
      permissionNames = this.getPermissionNames(upperEntityName, method, path);
    } else {
      permissionNames = roles;
    }
    // request._parsedUrl.query = 'fields=fullname,deletedAt';
    // request._parsedUrl.search = '?fields=fullname,deletedAt';
    // request._parsedUrl.path += '?fields=fullname,deletedAt';
    // request._parsedUrl.href += '?fields=fullname,deletedAt';
    // request._parsedUrl._raw += '?fields=fullname,deletedAt';
    // request.originalUrl += '?fields=fullname,deletedAt';
    // request.url += '?fields=fullname,deletedAt';
    // console.log('request', request);

    // console.log('currentUserPermission', currentUserPermission);
    // console.log('permissionNames', permissionNames);
    return this.checkPermission(currentUserPermission, permissionNames);
  }
}
