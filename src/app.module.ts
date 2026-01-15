import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { Entidad } from './entities/Entidad';
import { Estatus } from './entities/Estatus';
import { Permiso } from './entities/Permiso';
import { Rol } from './entities/Rol';
import { TipoUsuario } from './entities/TipoUsuario';
import { Usuario } from './entities/Usuario';
import { CatalogoModule } from './modules/catalogo/catalogo.module';
import { Estado } from './entities/Estado';
import { Municipio } from './entities/Municipio';
import { EstatusBusquedaJugador } from './entities/EstatusBusquedaJugador';
import { Ficheros } from './entities/Ficheros';
import { InformacionPersonal } from './entities/InformacionPersonal';
import { InformacionPersonalModule } from './modules/informacion-personal/informacion-personal.module';
import { EstatusModule } from './modules/estatus/estatus.module';
import { FicherosModule } from './modules/ficheros/ficheros.module';
import { PosicionJuego } from './entities/PosicionJuego';
import { HistorialEventosInformacionPersonalModule } from './modules/historial-eventos-informacion-personal/historial-equipos-informacion-personal.module';
import { HistorialEntrenadoresInformacionPersonalModule } from './modules/historial-entrenadores-informacion-personal/historial-entrenadores-informacion-personal.module';
import { LogrosClaveInformacionPersonalModule } from './modules/logros-clave-informacion-personal/logros-clave-informacion-personal.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AuditLog } from './entities/AuditLog';
import { CoachModule } from './modules/coach/coach.module';
import { VistaJugadorPerfilModule } from './modules/vista-jugador-perfil/vista-jugador-perfil.module';
import { ComentariosPerfilJugadorModule } from './modules/comentarios-perfil-jugador/comentarios-perfil-jugador.module';
import { VistaJugadorPerfil } from './entities/VistaJugadorPerfil';
import { ComentariosPerfilJugador } from './entities/ComentariosPerfilJugador';
import { FavoritosJugadoresCoachModule } from './modules/favoritos-jugadores-coach/favoritos-jugadores-coach.module';
import { Sexo } from './entities/Sexo';
import { InformacionPersonalCoach } from './entities/InformacionPersonalCoach';
import { HistorialTrabajoCoach } from './entities/HistorialTrabajoCoach';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      // esto en teoria es para usar en azure <------------------
      // ssl: {
      //     rejectUnauthorized: true,
      // },
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        Entidad,
        Estatus,
        Permiso,
        Rol,
        TipoUsuario,
        Usuario,
        Estado,
        Municipio,
        EstatusBusquedaJugador,
        Ficheros,
        InformacionPersonal,
        PosicionJuego,
        AuditLog,
        VistaJugadorPerfil,
        ComentariosPerfilJugador,
        Sexo,
        InformacionPersonalCoach,
        HistorialTrabajoCoach
      ]
    }),
    AuthModule,
    UsuarioModule,
    CatalogoModule,
    InformacionPersonalModule,
    EstatusModule,
    FicherosModule,
    HistorialEventosInformacionPersonalModule,
    HistorialEntrenadoresInformacionPersonalModule,
    LogrosClaveInformacionPersonalModule,
    AuditLogModule,
    CoachModule,
    VistaJugadorPerfilModule,
    ComentariosPerfilJugadorModule,
    FavoritosJugadoresCoachModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
