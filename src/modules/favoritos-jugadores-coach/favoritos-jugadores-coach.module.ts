import { Module } from '@nestjs/common';
import { FavoritosJugadoresCoachService } from './favoritos-jugadores-coach.service';
import { FavoritosJugadoresCoachController } from './favoritos-jugadores-coach.controller';
import { FavoritosJugadoresCoach } from '../../entities/FavoritosJugadoresCoach';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [FavoritosJugadoresCoachController],
  providers: [FavoritosJugadoresCoachService],
  imports: [
    TypeOrmModule.forFeature([
      FavoritosJugadoresCoach
    ]),
    CommonModule,
  ]
})
export class FavoritosJugadoresCoachModule {}
