import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import Config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@app/User/index.module';
import { UserRepository } from '@app/User/Repository/index.repository';
import { JwtStrategy } from './Strategies/jwt.strategy';
import { LocalStrategy } from './Strategies/local.strategy';
import { AuthController } from './Controller/index.controller';
import { AuthService } from './Service/index.service';

const jwtConfig = Config.get('jwt');

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES || jwtConfig.expiresIn
      }
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
