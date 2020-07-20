import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@app/Common/Base/Repository/index.repository';
import { UseCrud } from '@common/decorators/crud.decorator';
import { Role } from '../index.entity';

@UseCrud(Role, {
  routes: {
    exclude: ['getOneBase', 'deleteOneBase']
  }
  // query: {
  //   exclude: ['password'],
  //   join: {
  //     role: {
  //       allow: ['name'],
  //       eager: true
  //     },
  //     'role.permissions': {
  //       eager: true
  //     }
  //   }
  // }
})
@EntityRepository(Role)
export class RoleRepository extends BaseRepository<Role> {}
