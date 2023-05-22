import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils /swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';




async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: '*',
    credentials: true
  })
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  const logger = new Logger('Main')

  app.setGlobalPrefix('api/v1')
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app)
  app.use(helmet())


  await app.listen(AppModule.port)

  // log docs
  const baseUrl = AppModule.getBaseUrl(app)
  const url = `http://${baseUrl}:${AppModule.port}`
  logger.log(`API Documentation available at ${url}/docs`);
}
bootstrap();

// node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
