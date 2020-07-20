import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@app/User/Repository/index.repository';
import { PermissionRepository } from '@app/Permission/Repository/index.repository';
import { RoleController } from './Controller/index.controller';
import { RoleService } from './Service/index.service';
import { RoleRepository } from './Repository/index.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleRepository,
      PermissionRepository,
      UserRepository
    ])
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
