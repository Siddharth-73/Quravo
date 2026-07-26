import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Parse cookies
  app.use(cookieParser());

  // Use Pino Logger
  app.useLogger(app.get(Logger));

  // Mandated API Versioning prefix from Day 1
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  app.get(Logger).log(`🚀 API Server running on http://localhost:${port}/api/v1`);
}

bootstrap();
