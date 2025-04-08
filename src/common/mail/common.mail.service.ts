import { name } from './../../../node_modules/@types/ejs/index.d';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { join, resolve } from 'path';
import { Templates } from '../enums/templates/common.templates.enum';
import { Usuario } from '../../entities/Usuario';
import { TemplatesTitles } from '../enums/templates/common.templates.titles.enum';
// import path = require('path');
// import hbs from 'nodemailer-express-handlebars';
// import * as Handlebars from 'handlebars';
import { create } from 'express-handlebars'; // Importa create
// import { nodemailerExpressHandlebars } from 'nodemailer-express-handlebars';
import * as path from 'path';
import * as Handlebars from 'handlebars'; // 
import * as hbs from 'nodemailer-express-handlebars';
import { readdir } from 'fs/promises'; // NO 'fs'
import { IAttachmentGif, IContextEmailCorreoBienvenida, IFileGif, IRequestEmail, IRequestEmailBienvenida } from '../interfaces/mail/index';
import { ErrorHandleService } from '../error/common.error-handle.service';
import { ErrorMethods } from '../enums/errors/common.error-handle.enum';

@Injectable()
export class MailService {
  
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private readonly errorHandleService: ErrorHandleService
    ) { }

    private async getIndexGif(type: string): Promise<IFileGif> {
      try {
        const ruta = resolve(__dirname, '../../assets/gif', type);
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
        const {files:archivos, index:randomIndex} = await this.getIndexGif('welcome');
        const attachment: IAttachmentGif = {
          filename: archivos[randomIndex],
          path: join(__dirname + "../../../assets") + "/gif/" + type + "/" + archivos[randomIndex],
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
        const {destinatario, asunto, template, context, attachments} = request;
        const gifAttachment = await this.getGif('welcome');

        const newAttachments = [
          ...(attachments || []),
          {
              filename: "HOOPArtboard 51@8x.png",
              path: join(__dirname + "../../../assets") + "/img/HOOPArtboard 51@8x.png",
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
        console.log(`Correo electrónico enviado a ${error}`);
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
        asunto: 'Bienvenido a nuestra plataforma'
      }

      return this.sendEmail(requestEmail);
    }

}
