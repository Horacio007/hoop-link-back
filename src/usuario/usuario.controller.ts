import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IResponse } from '../common/interfaces/responses/response';

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

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
