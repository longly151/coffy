// import { createParamDecorator, ExecutionContext, applyDecorators, SetMetadata, UseGuards, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
// import { Role } from '@src/app/Role/role.entity';
// import { RolesGuard } from '../guards/roles.guard';

// export const UserDecorator = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     console.log(ctx.getClass().name);
//     throw new ForbiddenException();
//     const request = ctx.switchToHttp().getRequest();
//     return request.user;
//   },
// );

// export function Auth(...roles: any) {
//   console.log('roles',roles);

//   return applyDecorators(
//     SetMetadata('roles', roles),
//     UseGuards(AuthGuard, RolesGuard),
//     ApiBearerAuth(),
//     ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
//   );
// }

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
