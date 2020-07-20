import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '@app/Auth/Guards/jwt-auth.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CrudName } from '@common/enums/crudName.enum';
import { RolesGuard } from '../guards/roles.guard';

export function ACL(ACLs: CrudName) {
  return applyDecorators(
    SetMetadata('ACLs', ACLs),
    UseGuards(JwtAuthGuard),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}
