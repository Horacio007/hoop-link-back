import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CoachController } from './coach.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformacionPersonal } from '../../entities/InformacionPersonal';
import { FicherosModule } from '../ficheros/ficheros.module';
import { CatalogoModule } from '../catalogo/catalogo.module';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CoachController],
  providers: [CoachService],
  imports:[
    TypeOrmModule.forFeature([
      InformacionPersonal,
    ]),
    FicherosModule,
    CatalogoModule,
    CommonModule,
    AuthModule
  ]
})
export class CoachModule {}
