import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PermissionRepository } from '../Repository/index.repository';
import { Permission } from '../index.entity';

@Injectable()
export class PermissionService extends TypeOrmCrudService<Permission> {
  constructor(
    @InjectRepository(Permission) repo,
    private readonly permissionRepository: PermissionRepository
  ) {
    super(repo);
  }
}
