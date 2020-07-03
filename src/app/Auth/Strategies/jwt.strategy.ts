import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as Config from "config";
import { getManager } from "typeorm";
import { UserStatus } from "@src/common/enums/userStatus.enum";
import { UserRepository } from "@src/app/User/Repository/index.repository";
import { User } from "../../User/user.entity";

const jwtConfig = Config.get("jwt");

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    // return false;
    const dbCurrentUser = await this.userRepository.findOne(payload.id, {
      select: ["hasExpiredToken", "status"],
    });
    if (dbCurrentUser.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Current user is not active");
    }
    if (dbCurrentUser.hasExpiredToken) {
      throw new UnauthorizedException("Session expired. Please login again");
    }
    // The payload is the object get from decoded the token
    return {
      id: payload.id,
      email: payload.email,
      fullName: payload.fullName,
      phone: payload.phone,
      avatar: payload.avatar,
      gender: payload.gender,
      birthday: payload.birthday,
      bio: payload.bio,
      note: payload.note,
      status: payload.status,
      role: payload.role,
      permissions: payload.permissions,
    };
  }
}
