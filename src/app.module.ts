import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@app/Auth/index.module';
import { UserModule } from '@app/User/index.module';
import { RoleModule } from '@app/Role/index.module';
import { PermissionModule } from '@app/Permission/index.module';
import { MediaModule } from '@app/Media/index.module';
import { ProductModule } from '@app/Product/index.module';
import { CategoryModule } from '@app/Category/index.module';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    CoreModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    UserModule,
    MediaModule,
    CategoryModule,
    ProductModule
  ],
  controllers: [AppController]
})
export class AppModule {}
