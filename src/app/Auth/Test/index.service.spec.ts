import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import Config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@app/User/Repository/index.repository';
import { AuthController } from '@app/Auth/Controller/index.controller';
import { AuthService } from '@app/Auth/Service/index.service';
import { LocalStrategy } from '@app/Auth/Strategies/local.strategy';
import { JwtStrategy } from '@app/Auth/Strategies/jwt.strategy';
import { UserModule } from '../../User/index.module';

const jwtConfig = Config.get('jwt');

describe('AuthService', () => {
  let service;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([UserRepository]),
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET || jwtConfig.secret,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES || jwtConfig.expiresIn
          }
        })
      ],
      controllers: [AuthController],
      providers: [
        AuthService, LocalStrategy, JwtStrategy]
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
