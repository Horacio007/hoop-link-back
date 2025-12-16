import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CoachController } from './coach.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformacionPersonal } from '../../entities/InformacionPersonal';
import { FicherosModule } from '../ficheros/ficheros.module';
import { CatalogoModule } from '../catalogo/catalogo.module';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { VistaJugadorPerfilModule } from '../vista-jugador-perfil/vista-jugador-perfil.module';
import { InformacionPersonalModule } from '../informacion-personal/informacion-personal.module';
import { FavoritosJugadoresCoachModule } from '../favoritos-jugadores-coach/favoritos-jugadores-coach.module';

@Module({
  controllers: [CoachController],
  providers: [CoachService],
  imports:[
    TypeOrmModule.forFeature([
      InformacionPersonal,
    ]),
    FicherosModule,
    CatalogoModule,
    CommonModule,
    AuthModule,
    VistaJugadorPerfilModule,
    InformacionPersonalModule,
    FavoritosJugadoresCoachModule
  ]
})
export class CoachModule {}
