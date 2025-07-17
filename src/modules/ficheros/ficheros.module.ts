import { Module } from '@nestjs/common';
import { FicherosService } from './ficheros.service';
import { FicherosController } from './ficheros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { Ficheros } from '../../entities/Ficheros';
import { EstatusModule } from '../estatus/estatus.module';

@Module({
  controllers: [FicherosController],
  providers: [FicherosService],
  imports: [
    TypeOrmModule.forFeature([
      Ficheros
    ]),
    CommonModule,
    EstatusModule
  ],
  exports: [FicherosService]
})
export class FicherosModule {}
