/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerDocumentOptions,
  SwaggerCustomOptions
} from '@nestjs/swagger';
import config from 'config';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' });

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
    .setTitle('Coffy API')
    .setDescription('The Coffy API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    deepScanRoutes: true
  };

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocumentOptions
  );

  const swaggerSetupOptions: SwaggerCustomOptions = {
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
}
bootstrap();
