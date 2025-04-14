import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ErrorHandleService } from '../common/error/common.error-handle.service';
import { ErrorMethods } from '../common/enums/errors/common.error-handle.enum';
import { Usuario } from '../entities/Usuario';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResponse } from '../common/interfaces/responses/response';
import { Estatus } from '../entities/Estatus';
import { PasswordService } from '../common/password/password.service';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { MailService } from '../common/mail/common.mail.service';
import { IRequestEmail, IRequestEmailBienvenida } from '../common/interfaces/mail';

@Injectable()
export class UsuarioService {

  constructor(
    private readonly errorService:ErrorHandleService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository:Repository<Usuario>,
    @InjectRepository(Estatus)
    private readonly estatusRepository:Repository<Estatus>,
    private readonly passwordService:PasswordService,
    private readonly authService:AuthService,
    private readonly mailService:MailService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<IResponse<any>> {
    try {
      const usuarioExistente = await this.existeUsuario(createUsuarioDto.correo, createUsuarioDto.telefono);

      if (usuarioExistente) {
        if (usuarioExistente.correo)
          if (usuarioExistente.correo === createUsuarioDto.correo) this.errorService.setError(`El correo ya ha sido registrado.`);
  
        if (usuarioExistente.telefono)
          if (usuarioExistente.telefono === createUsuarioDto.telefono) this.errorService.setError(`El teléfono ya ha sido registrado.`);
      }
      
      
      const estatus = await this.estatusRepository.findOne({
        where: {entidadId: 2, nombre: 'pendiente'},
        select: {estatusId:true}
      });

      const password = await this.passwordService.hashPassword(createUsuarioDto.contrasena);

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
        estatusId: estatus.estatusId,
        contrasena: password
      }

      await this.usuarioRepository.create(newUser);
      const nuevoUsuario = await this.usuarioRepository.save(newUser);
      
      const payload:JwtPayload = {
        id: nuevoUsuario.usuarioId.toString(),
        nombre: nuevoUsuario.nombre,
        usuario: nuevoUsuario.correo
      };

      const token = await this.authService.getJwtToken(payload);

      const url = `http://localhost:4200/registro/valida-correo?token=${token}`;

      const request:IRequestEmailBienvenida = {
        destinatario:nuevoUsuario.correo,
        usuario: nuevoUsuario.nombre,
        enlaceConfirmacion: url
      }

      await this.mailService.enviarCorreoBienvenida(request);
  
      const response:IResponse<any> = {
        statusCode: HttpStatus.CREATED,
        mensaje: 'Registro creado exitosamente.',
      }

      return response;
    } catch (error) {
      this.errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async sendEmail(destinatario: string, usuario: string, enlaceConfirmacion: string) {
    try {
      await this.mailService.enviarCorreoBienvenida({destinatario, usuario, enlaceConfirmacion});
      console.log('Correo enviado a', destinatario);
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw error;
    }
  }

  async validaCorreoToken(token:string) {
    try {
      if (!token) this.errorService.setError('El token es inválido.')
      
      const payload:JwtPayload = await this.authService.validaToken(token);
      const user:Usuario = await this.usuarioRepository.findOne({
        where: {usuarioId: +payload.id, nombre: payload.nombre, correo: payload.usuario}
      });

      if (!user) this.errorService.setError('El token es inválido.');
      
      user.fechaEdicion = new Date();
      user.verificado = true;

      await this.usuarioRepository.save(user);

      const response:IResponse<any> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Usuario verificado exitosamente.',
      }

      return response;
    } catch (error) {
      if (error.name === ErrorMethods.TokenExpiredError) {
        this.errorService.errorHandle('Tu enlace ha expirado. Por favor ponte en contacto al siguiente correo:✉️ <strong>info@hooplink2.com</strong>', ErrorMethods.UnauthorizedException);
      }
  
      if (error.name === ErrorMethods.JsonWebTokenError) {
        this.errorService.errorHandle('El token es inválido.', ErrorMethods.UnauthorizedException)
      }

      this.errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  async existeUsuario(correo:string, telefono:string): Promise<Usuario> {
    try {
      const usuario = await this.usuarioRepository.find({
        where: [
          {correo: correo},
          {telefono: telefono}
        ],
        select: {correo:true, telefono:true}
      });
      
      return usuario[0];
    } catch (error) {
      this.errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

}
