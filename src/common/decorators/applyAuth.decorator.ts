import { SetMetadata } from '@nestjs/common';
import { CrudName } from '@common/enums/crudName.enum';

// export function ApplyAuth(...crudName: CrudName[]): any {
//   return function actualDecorator(Class) {
//     return function(...args) {
//       // console.log('Object receive another params: ', crudName);
//       // console.log('Object created with args: ', args);
//       // console.log('Class', Class.staticVal);
//       return new Class(...args);
//     };
//   };
// }

export const ApplyAuth = (...applyAuthCrudNames: CrudName[]) => SetMetadata('applyAuthCrudNames', applyAuthCrudNames);
