import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import * as _ from "lodash";

@Injectable()
export class AuthorFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const { idForeignKey } = currentUser;
    const filterObj = { [idForeignKey]: { eq: currentUser.id } };
    request.NESTJSX_PARSED_CRUD_REQUEST_KEY.parsed.filter.push({
      field: `${currentUser.idForeignKey}`,
      operator: "eq",
      value: currentUser.id,
    });
    request.NESTJSX_PARSED_CRUD_REQUEST_KEY.parsed.search.$and.push(filterObj);
    return next.handle();
  }
}
