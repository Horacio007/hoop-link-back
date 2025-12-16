import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { AccessTokenGuard } from '../auth/guard/auth/access-token.guard';
import { User } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get('list-all-jugadores')
  @UseGuards(AccessTokenGuard)
  async findAll(@User() user: JwtPayload,) {
    return await this.coachService.findAll(+user.id);
  }

  @Post('save-vista-perfil/:id')
  @UseGuards(AccessTokenGuard)
  async saveVistaPerfil(
    @User() user: JwtPayload,
    @Param('id') informacionPersonalId: number
  ) {
    return await this.coachService.saveVistaPerfil(+user.id, informacionPersonalId);
  }

  @Post('save-favorito-perfil/:id')
  @UseGuards(AccessTokenGuard)
  async saveFavoritoPerfil(
    @User() user: JwtPayload,
    @Param('id') informacionPersonalId: number
  ) {
    return await this.coachService.saveFavoritoPerfil(+user.id, informacionPersonalId);
  }

  @Get('list-all-jugadores-favoritos')
  @UseGuards(AccessTokenGuard)
  async findAllFavoritos(@User() user: JwtPayload,) {
    return await this.coachService.findAllFavoritos(+user.id);
  }
}
