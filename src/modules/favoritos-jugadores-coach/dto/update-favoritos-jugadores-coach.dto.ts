import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoritosJugadoresCoachDto } from './create-favoritos-jugadores-coach.dto';

export class UpdateFavoritosJugadoresCoachDto extends PartialType(CreateFavoritosJugadoresCoachDto) {}
