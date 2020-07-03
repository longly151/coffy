import { applyDecorators, UseGuards, SetMetadata } from "@nestjs/common";
import { JwtAuthGuard } from "@src/app/Auth/Guards/jwt-auth.guard";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { RolesGuard } from "../guards/roles.guard";

export function ACL(...ACLs: string[]) {
  return applyDecorators(
    SetMetadata("ACLs", ACLs),
    UseGuards(JwtAuthGuard),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
