import { Module } from '@nestjs/common';
import { InformacionPersonalService } from './informacion-personal.service';
import { InformacionPersonalController } from './informacion-personal.controller';
import { InformacionPersonal } from '../../entities/InformacionPersonal';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { FicherosModule } from '../ficheros/ficheros.module';
import { CatalogoModule } from '../catalogo/catalogo.module';

@Module({
  controllers: [InformacionPersonalController],
  providers: [InformacionPersonalService],
  imports: [
    TypeOrmModule.forFeature([
      InformacionPersonal
    ]),
    CommonModule,
    AuthModule,
    FicherosModule,
    CatalogoModule,
  ],
  exports: [InformacionPersonalService]
})
export class InformacionPersonalModule {}
