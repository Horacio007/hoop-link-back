import { Module } from '@nestjs/common';
import { VistaJugadorPerfilService } from './vista-jugador-perfil.service';
import { VistaJugadorPerfilController } from './vista-jugador-perfil.controller';
import { VistaJugadorPerfil } from '../../entities/VistaJugadorPerfil';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [VistaJugadorPerfilController],
  providers: [VistaJugadorPerfilService],
  imports: [
    TypeOrmModule.forFeature([
      VistaJugadorPerfil
    ]),
    CommonModule,
  ],
  exports: [VistaJugadorPerfilService]
})
export class VistaJugadorPerfilModule {}
