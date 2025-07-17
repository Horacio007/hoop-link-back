import { Module } from '@nestjs/common';
import { EstatusService } from './estatus.service';
import { EstatusController } from './estatus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estatus } from '../../entities/Estatus';

@Module({
  controllers: [EstatusController],
  imports: [
    TypeOrmModule.forFeature([
      Estatus,
    ]),
  ],
  providers: [EstatusService],
  exports: [EstatusService]
})
export class EstatusModule {}
