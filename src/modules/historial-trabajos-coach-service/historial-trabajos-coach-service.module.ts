import { Module } from '@nestjs/common';
import { HistorialTrabajosCoachService} from './historial-trabajos-coach-service.service';
import { HistorialTrabajosCoachServiceController } from './historial-trabajos-coach-service.controller';
import { HistorialTrabajoCoach } from '../../entities/HistorialTrabajoCoach';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [HistorialTrabajosCoachServiceController],
  providers: [HistorialTrabajosCoachService],
  imports: [
      TypeOrmModule.forFeature([
        HistorialTrabajoCoach
      ]),
      CommonModule,
    ],
    exports: [HistorialTrabajosCoachService]
})
export class HistorialTrabajosCoachServiceModule {}
