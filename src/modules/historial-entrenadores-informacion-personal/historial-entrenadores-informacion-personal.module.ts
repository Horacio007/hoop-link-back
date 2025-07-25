import { Module } from '@nestjs/common';
import { HistorialEntrenadoresInformacionPersonalService } from './historial-entrenadores-informacion-personal.service';
import { HistorialEntrenadoresInformacionPersonalController } from './historial-entrenadores-informacion-personal.controller';
import { HistorialEntrenadoresInformacionPersonal } from '../../entities/HistorialEntrenadoresInformacionPersonal';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [HistorialEntrenadoresInformacionPersonalController],
  providers: [HistorialEntrenadoresInformacionPersonalService],
  imports: [
    TypeOrmModule.forFeature([
      HistorialEntrenadoresInformacionPersonal
    ]),
    CommonModule,
  ],
  exports: [HistorialEntrenadoresInformacionPersonalService]
})
export class HistorialEntrenadoresInformacionPersonalModule {}
