import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComentariosPerfilJugadorService } from './comentarios-perfil-jugador.service';
import { CreateComentariosPerfilJugadorDto } from './dto/create-comentarios-perfil-jugador.dto';
import { UpdateComentariosPerfilJugadorDto } from './dto/update-comentarios-perfil-jugador.dto';
import { User } from '../../common/decorators/user.decorator';
import { AccessTokenGuard } from '../auth/guard/auth/access-token.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('comentarios-perfil-jugador')
export class ComentariosPerfilJugadorController {
  constructor(private readonly comentariosPerfilJugadorService: ComentariosPerfilJugadorService) {}

  @Post('save')
  @UseGuards(AccessTokenGuard)
  async create(@Body() comentarioSave: CreateComentariosPerfilJugadorDto, @User() user: JwtPayload) {
    return await this.comentariosPerfilJugadorService.create(+user.id, comentarioSave);
  }

  @Get('perfil/:id')
  @UseGuards(AccessTokenGuard)
  async findAll(@Param('id') id: number) {
    return await this.comentariosPerfilJugadorService.findAll(+id);
  }
}
