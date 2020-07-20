import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './Controller/index.controller';
import { PermissionService } from './Service/index.service';
import { PermissionRepository } from './Repository/index.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService]
})
export class PermissionModule {}
