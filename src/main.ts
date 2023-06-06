import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const cookieSecret = configService.get('app.cookieSecret');

  await app.register(fastifyCookie, {
    secret: cookieSecret,
  });

  const port = configService.get('app.port');
  const host = configService.get('app.host');

  await app.listen(port, host);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
