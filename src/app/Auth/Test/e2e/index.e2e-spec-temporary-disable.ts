import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '@app/Auth/index.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@app/User/Repository/index.repository';
import { AppController } from '@src/app.controller';
import { getConnection } from 'typeorm';
import { User } from '@app/User/index.entity';
import { Role } from '@app/Role/index.entity';
import Bcrypt from '../../../../plugins/bcrypt.plugin';


describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'admin',
          database: 'e2e_test',
          entities: ['./**/*.entity.ts'],
          synchronize: true
        }),
        TypeOrmModule.forFeature([UserRepository]),
        AuthModule
      ],
      controllers: [AppController]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    /**
     * Seeding
     */
    // Role
    const admin = {
      name: 'ADMIN',
      description: 'ADMIN'
    };
    const operator = {
      name: 'OPERATOR',
      description: 'OPERATOR'
    };
    const sale = {
      name: 'SALE',
      description: 'SALE'
    };
    const intern = {
      name: 'INTERN',
      description: 'INTERN'
    };
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([admin, operator, sale, intern])
      .execute();
    const hashPass: string = await Bcrypt.hash('admin');

    // User
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          fullName: 'Admin',
          email: 'admin@gmail.com',
          password: hashPass,
          phone: '0327571918',
          avatar:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU',
          gender: 'MALE',
          birthday: '2011-10-05T14:48:00.000Z',
          bio: "I'm admin",
          note: 'Nothing',
          status: 'ACTIVE',
          roleId: 1
        }
      ])
      .execute();
  });

  it('<200> /POST Auth', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: 'admin@gmail.com',
        password: 'admin'
      })
      .expect(200);
    // .expect({
    //   data: AuthService.findAll()
    // });
  });

  it('<401> /POST Auth', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: 'admin@gmail.com',
        password: 'admin-fail'
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
