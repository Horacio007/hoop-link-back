import { Module } from '@nestjs/common';
import { HistorialEquiposInformacionPersonalService } from './historial-equipos-informacion-personal.service';
import { HistorialEventosInformacionPersonalController } from './historial-equipos-informacion-personal.controller';
import { HistorialEquiposInformacionPersonal } from '../../entities/HistorialEquiposInformacionPersonal';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [HistorialEventosInformacionPersonalController],
  providers: [HistorialEquiposInformacionPersonalService],
  imports: [
    TypeOrmModule.forFeature([
      HistorialEquiposInformacionPersonal
    ]),
    CommonModule,
  ],
  exports: [HistorialEquiposInformacionPersonalService]
})
export class HistorialEventosInformacionPersonalModule {}
