import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app.module';
import { ConfigurationService } from './config/configuration';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // statics
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // middlewares
  app.enableCors({
    origin: ['*', 'http://localhost:8081'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(compression());
  app.use(helmet());

  // versioning API

  const APP_ROUTE_PREFIX = 'api';
  app
    .enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    })
    .setGlobalPrefix(APP_ROUTE_PREFIX);

  // config documentation
  const config = new DocumentBuilder()
    .setTitle('Booking app')
    .setDescription('The Booking app API description')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Roles')
    .addTag('Bookings')
    .addTag('Services')
    .addTag('States')
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const configurationService = new ConfigurationService();

  const port = configurationService.getPort();

  SwaggerModule.setup(`${APP_ROUTE_PREFIX}/:version/docs`, app, document);

  await app.listen(port, async () => {
    const url = await app.getUrl();
    console.log(`listen on  ${url}`);
  });
}
bootstrap();
