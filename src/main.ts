import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Application Bootstrap
 * Sets up the NestJS application with validation and error handling
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Wallet Service running on http://localhost:${port}`);
}

bootstrap();
