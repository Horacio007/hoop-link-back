import { Module } from '@nestjs/common';
import { LogrosClaveInformacionPersonalService } from './logros-clave-informacion-personal.service';
import { LogrosClaveInformacionPersonalController } from './logros-clave-informacion-personal.controller';
import { LogrosClaveInformacionPersonal } from '../../entities/LogrosClaveInformacionPersonal';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [LogrosClaveInformacionPersonalController],
  providers: [LogrosClaveInformacionPersonalService],
  imports: [
    TypeOrmModule.forFeature([
      LogrosClaveInformacionPersonal
    ]),
    CommonModule,
  ],
  exports: [LogrosClaveInformacionPersonalService]
})
export class LogrosClaveInformacionPersonalModule {}
