import { Module } from '@nestjs/common';
import { ErrorHandleService } from './error/common.error-handle.service';
import { PasswordService } from './password/password.service';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail/common.mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { extname, join, resolve } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path = require('path');

@Module({
  imports:[
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST, // Ejemplo: 'smtp.gmail.com'
        port: parseInt(process.env.MAIL_PORT, 10),
        secure: false, // Cambiar a true para SSL/TLS
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
        logger: true, // Habilita logs detallados
        debug: true,  // Muestra mensajes de depuración SMTP
      },
      defaults: {
        from: '"Soporte" <info@hooplink2.com>', // Cambia esto a tu email
      },
      template: {
        dir: join(__dirname, '../common/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      options: { // Configuración de HBS directamente en 'options'
        partials: {
          dir: join(__dirname, '../common/mail/templates/partials'),
        },
        layouts: {
          dir: join(__dirname, '../common/mail/templates/layouts'),
          defaultLayout: 'main', // Intenta definir el defaultLayout aquí
          layoutExt: 'hbs',
        },
      },
    }),
  ],
  controllers: [],
  providers: [
    ErrorHandleService,
    PasswordService,
    MailService
  ],
  exports: [
    ErrorHandleService, 
    PasswordService,
    MailService
  ],
})
export class CommonModule {}
