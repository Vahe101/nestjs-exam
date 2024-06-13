import * as dotenv from 'dotenv';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Environments } from './common/enums';

dotenv.config();

async function bootstrap() {
  const expressApp = express();
  expressApp.get('/health', (req, res) => res.json({ success: 'ok' }));

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.useLogger(new Logger());

  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const NODE_ENV = configService.get<Environments>('NODE_ENV');

  if (NODE_ENV === Environments.DEVELOPMENT) {
    const options = new DocumentBuilder()
      .setTitle('Nestjs exam API')
      .setDescription('Smile 😊 You are working on a Unicorn 🦄')
      .setVersion('1.0')
      .addBearerAuth()
      .setExternalDoc('swagger.json', 'api-json')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  const APP_PORT = +configService.get<string>('APP_PORT');

  await app.startAllMicroservices();
  await app.listen(APP_PORT);
}
bootstrap();
