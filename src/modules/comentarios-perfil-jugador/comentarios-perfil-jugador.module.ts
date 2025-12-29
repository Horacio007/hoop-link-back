import { Module } from '@nestjs/common';
import { ComentariosPerfilJugadorService } from './comentarios-perfil-jugador.service';
import { ComentariosPerfilJugadorController } from './comentarios-perfil-jugador.controller';
import { ComentariosPerfilJugador } from '../../entities/ComentariosPerfilJugador';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { InformacionPersonalModule } from '../informacion-personal/informacion-personal.module';

@Module({
  controllers: [ComentariosPerfilJugadorController],
  providers: [ComentariosPerfilJugadorService],
  imports: [
    TypeOrmModule.forFeature([
      ComentariosPerfilJugador
    ]),
    CommonModule,
    AuthModule,
    InformacionPersonalModule
  ]
})
export class ComentariosPerfilJugadorModule {}
