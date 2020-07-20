import { applyDecorators } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import _ from 'lodash';
import { CrudName } from '@common/enums/crudName.enum';
import { Name } from './crudName.decorator';

export function UseCrud(entity: any, options?: any) {
  const excludeRoute = options?.routes ? options.routes.exclude : [
    'getOneBase',
    'replaceOneBase',
    'deleteOneBase'
  ];

  return applyDecorators(
    Crud(
      _.merge(
        {
          model: {
            type: entity
          },
          routes: {
            exclude: excludeRoute,
            getManyBase: {
              decorators: [Name(CrudName.GET_MANY)]
              // interceptors: [AuthorFilterInterceptor]
            },
            createOneBase: {
              decorators: [Name(CrudName.CREATE_ONE)]
            },
            createManyBase: {
              decorators: [Name(CrudName.CREATE_MANY)]
            },
            updateOneBase: {
              decorators: [Name(CrudName.UPDATE_ONE)],
              allowParamsOverride: true
            }
          },
          query: {
            limit: 10,
            maxLimit: 50,
            alwaysPaginate: true
          }
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
