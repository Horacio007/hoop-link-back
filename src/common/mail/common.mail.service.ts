// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
// import { join } from 'path';
// import { Templates } from '../enums/templates/common.templates.enum';
// import { Usuarios } from 'src/entities/Usuarios';
// import { TemplatesTitles } from '../enums/templates/common.templates.titles.enum';

// @Injectable()
// export class MailService {

//     // private transporter:nodemailer.Transporter;

//     // private options = {
//     //     viewEngine: {
//     //         partialsDir: join(__dirname, "..") + "common/views/partials",
//     //         layoutsDir: join(__dirname, "..") + "common/views/layouts",
//     //         extname: ".hbs",
//     //     },
//     //     extName: ".hbs",
//     //     viewPath: join(__dirname, "..") + "common/views",
//     // };

//     private attch = [
//         {
//             filename: "logo.png",
//             path: join(__dirname, "..") + "/assets/img/logo.png",
//             cid: "logo",
//         },
//         {
//             filename: "facebook2x.png",
//             path: join(__dirname, "..") + "/assets/img/facebook2x.png",
//             cid: "facebook",
//         },
//         {
//             filename: "instagram2x.png",
//             path: join(__dirname, "..") + "/assets/img/instagram2x.png",
//             cid: "instagram",
//         },
//     ];

//     constructor(
//         private readonly mailerService: MailerService
//     ) { }

//     async handleEmail(usuario, template, title) {

//         const message = await this.mailerService.sendMail({
//             to: usuario,
//             subject: title,
//             template: template, // Nombre del archivo de la plantilla sin la extensión
//             attachments: this.attch, // Parámetros para la plantilla, por ejemplo, { name: 'Usuario' }
//           });

//         // let info = await this.transporter.sendMail(message);

//         return message;
//     }

//     async handleEmailResponse(receiver, sender, tipo, respuesta) {

//         const values = {
//             receiverName: receiver[0].nombre,
//             senderName: sender[0].nombre + " " + sender[0].apellido,
//             senderPhone: sender[0].telefono,
//             senderMail: sender[0].usuario,
//             titulo: receiver[0].titulo,
//             estado: tipo ? sender[0].estado : receiver[0].estado,
//             ciudad: tipo ? sender[0].ciudad : receiver[0].ciudad,
//             colonia: tipo ? sender[0].colonia : receiver[0].colonia,
//             calle: tipo ? sender[0].calle : receiver[0].calle,
//           };

//         const message = await this.mailerService.sendMail({
//             from: '"Capitol City 🏙️" <foo@capitolcity.com>',
//             to: receiver[0].usuario,
//             subject:
//               respuesta === 2
//                 ? TemplatesTitles.terrenoNoDisponible
//                 : tipo
//                 ? TemplatesTitles.unVendedorQuiereQueLoContactes
//                 : TemplatesTitles.compradorInteresado,
//             template:
//               respuesta === 2
//                 ? Templates.rejectMessage
//                 : tipo
//                 ? Templates.ownerMessage
//                 : Templates.customerMessage,
//             context: values,// Nombre del archivo de la plantilla sin la extensión
//             attachments: this.attch, // Parámetros para la plantilla, por ejemplo, { name: 'Usuario' }
//           });

//         // let info = await this.transporter.sendMail(message);

//         return message;
//     }

//     async handleEmailPass(usuario: Usuarios, genPassword: string) {
//         const values = { nombre: usuario.nombre, password: genPassword };

//         const message = await this.mailerService.sendMail({
//             to: usuario.usuario,
//             subject: TemplatesTitles.recuperacionContrasena,
//             template: Templates.sendPass,
//             context: values,// Nombre del archivo de la plantilla sin la extensión
//             attachments: this.attch, // Parámetros para la plantilla, por ejemplo, { name: 'Usuario' }
//           });

//         // let info = await this.transporter.sendMail(message);

//         return message;
//     }

//     async handleEmailWelcome(nombre: string, usuario: string) {
//         const values = { nombre: nombre};

//         const message = await this.mailerService.sendMail({
//             to: usuario,
//             subject: TemplatesTitles.bienvenidoCapitolCity,
//             template: Templates.welcome,
//             context: values,// Nombre del archivo de la plantilla sin la extensión
//             attachments: this.attch, // Parámetros para la plantilla, por ejemplo, { name: 'Usuario' }
//           });

//         // let info = await this.transporter.sendMail(message);

//         return message;
//     }

// }
