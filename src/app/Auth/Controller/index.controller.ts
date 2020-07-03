import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Get,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { LocalAuthGuard } from "../Guards/local-auth.guard";
import { LoginDto } from "../Dto/login.dto";
import { JwtAuthGuard } from "../Guards/jwt-auth.guard";
import { AuthService } from "../Service/index.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Login for administrator" })
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user by access_token" })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  getProfile(@Request() req) {
    return req.user;
  }
}
