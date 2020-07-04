import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AuthModule } from './app/Auth/auth.module';
import { UserModule } from './app/User/user.module';
import { CoreModule } from './core/core.module';
import { RoleModule } from './app/Role/role.module';
import { PermissionModule } from './app/Permission/permission.module';
// import { PostModule } from './app/Post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    CoreModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    UserModule
    // PostModule
  ],
  controllers: [AppController]
})
export class AppModule {}
