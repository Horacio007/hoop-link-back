import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { join, resolve } from 'path';
// import path = require('path');
// import hbs from 'nodemailer-express-handlebars';
// import * as Handlebars from 'handlebars';
import { create } from 'express-handlebars'; // Importa create
// import { nodemailerExpressHandlebars } from 'nodemailer-express-handlebars';
import * as path from 'path';
import * as Handlebars from 'handlebars'; // 
import * as hbs from 'nodemailer-express-handlebars';
import { readdir } from 'fs/promises'; // NO 'fs'
import { IAttachmentGif, IContextEmailCorreoBienvenida, IContextEmailCorreoRecuperacionContrasena, IFileGif, IRequestEmail, IRequestEmailBienvenida, IRequestEmailRecuperaContrasena } from '../interfaces';
import { ErrorHandleService } from '../../error/services/common.error-handle.service';
import { ErrorMethods } from '../../error/enum/common.error-handle.enum';

@Injectable()
export class MailService {
  
    private isProd = process.env.NODE_ENV === 'production';

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private readonly errorHandleService: ErrorHandleService
    ) { }

    private async getIndexGif(type: string): Promise<IFileGif> {
      try {
        const ruta = this.isProd ? resolve(__dirname, '../../../assets/gif', type) : resolve(__dirname, '../../../assets/gif', type);
        const archivos = await readdir(ruta); // ¡Aquí usas await correctamente!
        const randomIndex = Math.floor(Math.random() * archivos.length);

        return {
          index: randomIndex,
          files: archivos
        };
      } catch (error) {
        this.errorHandleService.errorHandle(error, ErrorMethods.BadRequestException);
      }
    }

    private async getGif(type: string): Promise<IAttachmentGif> {
      try {
        const {files:archivos, index:randomIndex} = await this.getIndexGif(type);
        const attachment: IAttachmentGif = {
          filename: archivos[randomIndex],
          path: this.isProd ? join(__dirname + "../../../../assets") + "/gif/" + type + "/" + archivos[randomIndex] : join(__dirname + "../../../../assets") + "/gif/" + type + "/" + archivos[randomIndex],
          cid: 'gif'
        };

        return attachment;
      } catch (error) {
        this.errorHandleService.errorHandle(error, ErrorMethods.BadRequestException);
      }
    }

    private async sendEmail(request: IRequestEmail) {
      try {
        console.log(request);
        const {destinatario, asunto, template, context, attachments, tipoGif} = request;
        const gifAttachment = await this.getGif(tipoGif);

        const newAttachments = [
          ...(attachments || []),
          {
              filename: "HOOPArtboard 51@8x.png",
              path: this.isProd ? join(__dirname + "../../../../assets") + "/img/HOOPArtboard 51@8x.png" : join(__dirname + "../../../../assets") + "/img/HOOPArtboard 51@8x.png",
              cid: "logo",
          },
          gifAttachment
        ];

        await this.mailerService.sendMail({
          to: destinatario,
          subject: asunto,
          template: template, // Nombre del archivo .hbs en la carpeta 'templates/emails'
          context: context,
          attachments: newAttachments,
        });
        console.log(`Correo electrónico enviado a ${destinatario}`);
      } catch (error) {
        console.log(`Error: ${error}`);
        this.errorHandleService.errorHandle(error, ErrorMethods.BadRequestException);
      }
    }
  
    async enviarCorreoBienvenida(request:IRequestEmailBienvenida) {
      const { destinatario, usuario, enlaceConfirmacion } = request;

      const context:IContextEmailCorreoBienvenida = {
        enlaceConfirmacion,
        nombre: usuario
      };

      const requestEmail:IRequestEmail = {
        destinatario,
        template: 'emails/welcome',
        context,
        asunto: 'Bienvenido a nuestra plataforma',
        tipoGif: 'welcome'
      }

      return this.sendEmail(requestEmail);
    }

    async enviarCorreoRecuperaContrasena(request:IRequestEmailRecuperaContrasena) {
      const { destinatario, usuario, password, url } = request;

      const context:IContextEmailCorreoRecuperacionContrasena = {
        nombre: usuario,
        password,
        url
      };

      const requestEmail:IRequestEmail = {
        destinatario,
        template: 'emails/recupera-contrasena',
        context,
        asunto: 'Recuperación de contraseña',
        tipoGif: 'dont-forget'
      }

      return this.sendEmail(requestEmail);
    }

}
