import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('main')

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // app.setBaseViewsDir(__dirname + '/views');
  hbs.registerPartials(__dirname + '/views/partials');
  // app.setViewEngine('hbs');
  // app.set('view options', { layout: 'index' });

  app.use(cookieParser()); // ✅ Necesario para acceder a req.cookies

  app.enableCors({
    origin: (origin, callback) => {
      // Permite solicitudes sin origen (Postman, backends, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = ['http://localhost:4200', 'https://hooplink2.com'];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Permitir credenciales si la petición las tiene
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  logger.log(`App running on port ${process.env.PORT_LAUNCH}`);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
