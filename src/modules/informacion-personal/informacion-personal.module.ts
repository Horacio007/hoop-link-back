import { Module } from '@nestjs/common';
import { InformacionPersonalService } from './informacion-personal.service';
import { InformacionPersonalController } from './informacion-personal.controller';
import { InformacionPersonal } from '../../entities/InformacionPersonal';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { FicherosModule } from '../ficheros/ficheros.module';
import { CatalogoModule } from '../catalogo/catalogo.module';
import { HistorialEntrenadoresInformacionPersonalModule } from '../historial-entrenadores-informacion-personal/historial-entrenadores-informacion-personal.module';
import { HistorialEventosInformacionPersonalModule } from '../historial-eventos-informacion-personal/historial-equipos-informacion-personal.module';
import { LogrosClaveInformacionPersonalModule } from '../logros-clave-informacion-personal/logros-clave-informacion-personal.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { VistaJugadorPerfilModule } from '../vista-jugador-perfil/vista-jugador-perfil.module';
import { FavoritosJugadoresCoachModule } from '../favoritos-jugadores-coach/favoritos-jugadores-coach.module';

@Module({
  controllers: [InformacionPersonalController],
  providers: [InformacionPersonalService],
  imports: [
    TypeOrmModule.forFeature([
      InformacionPersonal
    ]),
    CommonModule,
    AuthModule,
    FicherosModule,
    CatalogoModule,
    HistorialEntrenadoresInformacionPersonalModule,
    HistorialEventosInformacionPersonalModule,
    LogrosClaveInformacionPersonalModule,
    AuditLogModule,
    VistaJugadorPerfilModule,
    FavoritosJugadoresCoachModule
  ],
  exports: [InformacionPersonalService]
})
export class InformacionPersonalModule {}
