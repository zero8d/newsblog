import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(<string>process.env.PORT);
  await app.listen(<string>process.env.PORT);
}
bootstrap();
