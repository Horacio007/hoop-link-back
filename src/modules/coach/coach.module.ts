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
import { AuditLogModule } from '../audit-log/audit-log.module';
import { HistorialTrabajosCoachServiceModule } from '../historial-trabajos-coach-service/historial-trabajos-coach-service.module';
import { InformacionPersonalCoach } from '../../entities/InformacionPersonalCoach';

@Module({
  controllers: [CoachController],
  providers: [CoachService],
  imports:[
    TypeOrmModule.forFeature([
      InformacionPersonal,
    ]),
    TypeOrmModule.forFeature([
      InformacionPersonalCoach,
    ]),
    FicherosModule,
    CatalogoModule,
    CommonModule,
    AuthModule,
    VistaJugadorPerfilModule,
    InformacionPersonalModule,
    FavoritosJugadoresCoachModule,
    AuditLogModule,
    HistorialTrabajosCoachServiceModule
  ]
})
export class CoachModule {}
