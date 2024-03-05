import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  app.useGlobalPipes(new ValidationPipe());
  console.info(`listening on port: ${port}`);
}
bootstrap();
