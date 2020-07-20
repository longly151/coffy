import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './app/Auth/index.module';
import { UserModule } from './app/User/index.module';

describe('AppController', () => {
  let appController: AppController;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), AuthModule, UserModule],
      controllers: [AppController]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    appController = moduleRef.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
