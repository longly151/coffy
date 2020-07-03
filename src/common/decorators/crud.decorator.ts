import { applyDecorators } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import * as _ from "lodash";
import { ACL } from "./acl.decorator";
import { AccessControlList } from "../enums/accessControlList";

export function UseCrud(entity: any, options?: any) {
  return applyDecorators(
    Crud(
      _.merge(
        {
          model: {
            type: entity,
          },
          routes: {
            exclude: [
              "getOneBase",
              "createManyBase",
              "replaceOneBase",
              "deleteOneBase",
            ],
            getManyBase: {
              decorators: [ACL(AccessControlList.DEFAULT)],
              // interceptors: [AuthorFilterInterceptor]
            },
            createOneBase: {
              decorators: [ACL(AccessControlList.DEFAULT)],
            },
            createManyBase: {
              decorators: [ACL(AccessControlList.DEFAULT)],
            },
            updateOneBase: {
              decorators: [ACL(AccessControlList.DEFAULT)],
              allowParamsOverride: true,
            },
            deleteOneBase: {
              decorators: [ACL(AccessControlList.DEFAULT)],
              returnDeleted: true,
            },
          },
          query: {
            limit: 10,
            maxLimit: 50,
            alwaysPaginate: true,
          },
          // params: {
          //   id: {
          //     primary: true,
          //     disabled: true,
          //   },
          // },

          // dto: {
          //   create: User,
          //   update: User,
          // },
        },
        options
      )
    )
  );
}
