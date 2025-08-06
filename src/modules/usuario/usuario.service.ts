import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { Usuario } from '../../entities/Usuario';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResponse } from '../../common/interfaces/responses/response';
import { PasswordService } from '../../common/password/password.service';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { MailService } from '../../common/mail/services/common.mail.service';
import { IRequestEmail, IRequestEmailBienvenida, IRequestEmailRecuperaContrasena } from '../../common/mail/interfaces';
import { IRecuperaContrasena } from './interfaces/recupera-contrasena.interface';
import { EstatusService } from '../estatus/estatus.service';

@Injectable()
export class UsuarioService {

  private isProd = process.env.NODE_ENV === 'production';

  constructor(
    private readonly _errorService:ErrorHandleService,
    @InjectRepository(Usuario)
    private readonly _usuarioRepository:Repository<Usuario>,
    private readonly _estatusService:EstatusService,
    private readonly _passwordService:PasswordService,
    private readonly _authService:AuthService,
    private readonly _mailService:MailService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<IResponse<any>> {
    try {
      const usuarioExistente = await this.existeUsuario(createUsuarioDto.correo, createUsuarioDto.telefono);

      if (usuarioExistente) {
        if (usuarioExistente.correo)
          if (usuarioExistente.correo === createUsuarioDto.correo) this._errorService.setError(`El correo ya ha sido registrado.`);
  
        if (usuarioExistente.telefono)
          if (usuarioExistente.telefono === createUsuarioDto.telefono) this._errorService.setError(`El teléfono ya ha sido registrado.`);
      }
      
      
      const estatusId = await this._estatusService.getEstatusActivoId();

      const password = await this._passwordService.hashPassword(createUsuarioDto.contrasena);

      const newUser = {
        nombre: createUsuarioDto.nombre,
        aPaterno: createUsuarioDto.apellidoPaterno,
        aMaterno: createUsuarioDto.apellidoMaterno,
        fechaNacimiento: createUsuarioDto.fechaNacimiento,
        residencia: createUsuarioDto.residencia,
        correo: createUsuarioDto.correo,
        telefono: createUsuarioDto.telefono,
        tipoUsuarioId: +createUsuarioDto.tipoUsuario.id,
        municipioId: +createUsuarioDto.municipio.id,
        estatusId,
        contrasena: password
      }

      await this._usuarioRepository.create(newUser);
      const nuevoUsuario = await this._usuarioRepository.save(newUser);
      
      const payload:JwtPayload = {
        id: nuevoUsuario.usuarioId.toString(),
        nombre: nuevoUsuario.nombre,
        usuario: nuevoUsuario.correo
      };

      const token = await this._authService.getJwtToken(payload);

      const url = `${this.isProd ? process.env.HOST_FRONT_PROD : process.env.HOST_FRONT_DEV}/registro/valida-correo?token=${token}`;

      const request:IRequestEmailBienvenida = {
        destinatario:nuevoUsuario.correo,
        usuario: nuevoUsuario.nombre,
        enlaceConfirmacion: url
      }

      await this._mailService.enviarCorreoBienvenida(request);
  
      const response:IResponse<any> = {
        statusCode: HttpStatus.CREATED,
        mensaje: 'Registro creado exitosamente.',
      }

      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async sendEmail(destinatario: string, usuario: string, enlaceConfirmacion: string) {
    try {
      await this._mailService.enviarCorreoBienvenida({destinatario, usuario, enlaceConfirmacion});
      console.log('Correo enviado a', destinatario);
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw error;
    }
  }

  async validaCorreoToken(token:string) {
    try {
      if (!token) this._errorService.setError('El token es inválido.')
      
      const payload:JwtPayload = await this._authService.validaToken(token);
      const user:Usuario = await this._usuarioRepository.findOne({
        where: {usuarioId: +payload.id, nombre: payload.nombre, correo: payload.usuario}
      });

      if (!user) this._errorService.setError('El token es inválido.');
      
      user.fechaEdicion = new Date();
      user.verificado = true;

      await this._usuarioRepository.save(user);

      const response:IResponse<any> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Usuario verificado exitosamente.',
      }

      return response;
    } catch (error) {
      if (error.name === ErrorMethods.TokenExpiredError) {
        this._errorService.errorHandle('Tu enlace ha expirado. Por favor ponte en contacto al siguiente correo:✉️ <strong>info@hooplink2.com</strong>', ErrorMethods.UnauthorizedException);
      }
  
      if (error.name === ErrorMethods.JsonWebTokenError) {
        this._errorService.errorHandle('El token es inválido.', ErrorMethods.UnauthorizedException)
      }

      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async recuperaContrasena(correo: IRecuperaContrasena) {
    try {
      const usuarioExistente = await this.existeUsuario(correo.correo);

      const response:IResponse<any> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña. Revisa también tu bandeja de spam o correo no deseado.',
      }

      if (!usuarioExistente) return response;
      
      const newPassword = await this._passwordService.generateRandomPassword();
      const passwordEncrypted = await this._passwordService.hashPassword(newPassword);

      const user:Usuario = await this._usuarioRepository.findOne({
        where: {correo: correo.correo}
      });

      user.contrasena = passwordEncrypted;
      user.usuarioEdicion = user.usuarioId;
      user.fechaEdicion = new Date();
      await this._usuarioRepository.save(user);

      const url = `${this.isProd ? process.env.HOST_FRONT_PROD : process.env.HOST_FRONT_DEV}/login`;
      const request:IRequestEmailRecuperaContrasena = {
        destinatario: user.correo,
        usuario: user.nombre,
        password: newPassword,
        url
      }

      await this._mailService.enviarCorreoRecuperaContrasena(request);

      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async existeUsuario(correo:string = '', telefono:string = ''): Promise<Usuario> {
    try {
      const usuario = await this._usuarioRepository.find({
        where: [
          {correo: correo},
          {telefono: telefono}
        ],
        select: {correo:true, telefono:true}
      });
      
      return usuario[0];
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

}
