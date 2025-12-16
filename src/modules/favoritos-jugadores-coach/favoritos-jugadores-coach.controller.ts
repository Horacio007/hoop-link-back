import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoritosJugadoresCoachService } from './favoritos-jugadores-coach.service';
import { CreateFavoritosJugadoresCoachDto } from './dto/create-favoritos-jugadores-coach.dto';
import { UpdateFavoritosJugadoresCoachDto } from './dto/update-favoritos-jugadores-coach.dto';

@Controller('favoritos-jugadores-coach')
export class FavoritosJugadoresCoachController {
  constructor(private readonly favoritosJugadoresCoachService: FavoritosJugadoresCoachService) {}
}
