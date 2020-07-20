import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
import { extractEntity, extractTableName } from '@core/utils/appHelper';
import { CrudName } from '@common/enums/crudName.enum';
import { AccessControlList } from '../enums/accessControlList.enum';

type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  getRequiredPermissionNames(
    upperEntityName: string,
    crudName: CrudName
  ): Array<string> {
    let requiredPermissionNames: Array<string> = [];

    switch (crudName) {
      case CrudName.GET_MANY:
      case CrudName.GET_ONE:
        requiredPermissionNames.push(
          `${upperEntityName}_READ`,
          `SELF_${upperEntityName}_READ`
        );
        break;
      case CrudName.CREATE_ONE:
      case CrudName.CREATE_MANY:
        requiredPermissionNames.push(
          `${upperEntityName}_CREATE`,
          `SELF_${upperEntityName}_CREATE`
        );
        break;
      case CrudName.UPDATE_ONE:
        requiredPermissionNames.push(
          `${upperEntityName}_UPDATE`,
          `SELF_${upperEntityName}_UPDATE`
        );
        break;
      case CrudName.GET_TRASHED:
      case CrudName.DELETE_ONE:
      case CrudName.RESTORE_ONE:
        requiredPermissionNames.push(
          `${upperEntityName}_DELETE`,
          `SELF_${upperEntityName}_DELETE`
        );
        break;
      case CrudName.DELETE_ONE_PERMANENTLY:
        requiredPermissionNames.push(
          `${upperEntityName}_PERMANENTLY_DELETE`,
          `SELF_${upperEntityName}_PERMANENTLY_DELETE`
        );
        break;
      default:
        requiredPermissionNames = [];
    }
    return requiredPermissionNames;
  }

  checkPermission(
    currentUserPermission: Array<string>,
    requiredPermissionNames: Array<string>
  ): boolean {
    // Admin Permission
    if (_.includes(currentUserPermission, AccessControlList.ALL)) {
      return true;
    }
    // Other Permissions
    if (!_.isEmpty(_.intersection(currentUserPermission, requiredPermissionNames))) {
      return true;
    }
    return false;
  }

  canActivate(context: ExecutionContext): boolean {
    const applyAuthCrudNames = this.reflector.get<string[]>('applyAuthCrudNames', context.getClass());
    const crudName = Reflect.getMetadata('name', context.getHandler());

    if(!_.includes(applyAuthCrudNames, CrudName.ALL) && _.isEmpty(_.intersection([crudName], applyAuthCrudNames))){
      return true;
    }

    // Get Current User's Permission
    const request = context.switchToHttp().getRequest();

    const { user } = request;
    const currentUserPermission = user.permissions;

    // Get Current Required Permission Names
    const upperEntityName = _.toUpper(extractEntity(context.getClass().name));
    const requiredPermissionNames = this.getRequiredPermissionNames(upperEntityName, crudName);

    // Prevent user from deleting himself / herself
    if (request.method === 'DELETE' && user.table === extractTableName(context.getClass().name)) {
      if(parseInt(request.params.id, 10) === user.id) {
        throw new ForbiddenException('Cannot delete yourself');
      }
    }

    return this.checkPermission(currentUserPermission, requiredPermissionNames);
  }
}
