import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@app/Common/Base/Repository/index.repository';
import { Permission } from '../index.entity';

@EntityRepository(Permission)
export class PermissionRepository extends BaseRepository<Permission> {}
