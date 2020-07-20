import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
import { CrudName } from '@common/enums/crudName.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const applyAuthCrudNames = this.reflector.get<string[]>('applyAuthCrudNames', context.getClass());
    if(_.includes(applyAuthCrudNames, CrudName.ALL)) return super.canActivate(context);
    const name = Reflect.getMetadata('name', context.getHandler());
    if(_.isEmpty(_.intersection([name], applyAuthCrudNames))){
      return true;
    }
    return super.canActivate(context);
  }
}
