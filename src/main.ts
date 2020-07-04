import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerDocumentOptions,
  SwaggerCustomOptions
} from '@nestjs/swagger';
import * as config from 'config';
import { createConnection, getConnection, Connection } from 'typeorm';
import { AppModule } from './app.module';

import { UserRole } from './app/Role/Enum/userRole.enum';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { typeOrmConfig } from './config/typeorm.config';

require('dotenv').config();

async function bootstrap() {
  /**
   * App Config
   */
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  await app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * Environment
   */
  app.enableCors();
  // if (process.env.NODE_ENV === 'development') {
  //   app.enableCors();
  // } else {
  //   app.enableCors({ origin: serverConfig.origin });
  // }

  /**
   * Swagger
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sanna Tour API')
    .setDescription('The Sanna Tour API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    // include?: Function[];
    // extraModels?: Function[];
    // ignoreGlobalPrefix?: boolean;
    // deepScanRoutes?: boolean;
    deepScanRoutes: true
  };

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocumentOptions
  );

  const swaggerSetupOptions: SwaggerCustomOptions = {
    // explorer?: boolean;
    // swaggerOptions?: any;
    // customCss?: string;
    // customJs?: string;
    // customfavIcon?: string;
    // swaggerUrl?: string;
    // customSiteTitle?: string;
    explorer: true,
    swaggerOptions: {
      docExpansion: false,
      deepLinking: true
    }
  };
  SwaggerModule.setup('docs', app, document, swaggerSetupOptions);

  /**
   * Init Server
   */
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  console.log(`Application listening on port ${port}`);

  // const connection: Connection = getConnection();
  // const categoryRepository = connection.getTreeRepository(Category);
  // const a = await categoryRepository.findTrees();
  // console.log(a[0]);

  // Update
  // const demo = await categoryRepository.findRoots();
  // demo[0].name = 'category #1';
  // categoryRepository.save(demo[0]);
  // console.log(demo[0]);

  // Only support softRemove for root & parent
  // await categoryRepository.softRemove(await categoryRepository.findRoots());

  // const connection: Connection = getConnection();
  // const destinationRepository = connection.getTreeRepository(Post);
  // const tree = await destinationRepository.findTrees();
  // console.log('demo', tree[4].childrenItems[0]);
}
bootstrap();
