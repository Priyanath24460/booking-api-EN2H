import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // ─── Global Validation Pipe ───────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields
      transform: true,       // auto-convert types (string→number, etc.)
      forbidNonWhitelisted: true, // throw error for unknown fields
    }),
  );

  // ─── Global Exception Filter ──────────────────────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ─── Swagger Documentation ────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription(
      'A RESTful API for managing services and bookings. ' +
      'Customers can book services without authentication. ' +
      'Staff/admin endpoints are protected with JWT.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'JWT-auth', // <-- this name is used in @ApiBearerAuth() decorators
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keeps token between page refreshes
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();