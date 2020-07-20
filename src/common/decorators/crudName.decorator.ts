import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '@app/Auth/Guards/jwt-auth.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CrudName } from '@common/enums/crudName.enum';
import { RolesGuard } from '../guards/roles.guard';

export function Name(name: CrudName) {
  return applyDecorators(
    SetMetadata('name', name),
    UseGuards(JwtAuthGuard),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}
