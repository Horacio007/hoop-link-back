import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IResponse } from '../common/interfaces/responses/response';
import { IRecuperaContrasena } from './interfaces/recupera-contrasena.interface';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('save')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<IResponse<any>> {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @Post('send')
  async sendEmail(@Body() body: { destinatario: string; usuario: string; enlaceConfirmacion: string }) {
    return this.usuarioService.sendEmail(body.destinatario, body.usuario, body.enlaceConfirmacion);
  }

  @Get('valida-token')
  @HttpCode(HttpStatus.OK)
  async validaToken(@Query('token') token: string): Promise<IResponse<any>> {
    return await this.usuarioService.validaCorreoToken(token);
  }

  @Post('recupera-contrasena')
  async recuperContrasena(@Body() correo: IRecuperaContrasena): Promise<IResponse<any>> {
    return this.usuarioService.recuperaContrasena(correo);
  }

}
