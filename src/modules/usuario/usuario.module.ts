import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { CommonModule } from '../../common/common.module';
import { Usuario } from '../../entities/Usuario';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipio } from '../../entities/Municipio';
import { TipoUsuario } from '../../entities/TipoUsuario';
import { AuthModule } from '../auth/auth.module';
import { EstatusModule } from '../estatus/estatus.module';
import { InformacionPersonalModule } from '../informacion-personal/informacion-personal.module';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Municipio,
      TipoUsuario
    ]),
    CommonModule,
    AuthModule,
    EstatusModule,
    InformacionPersonalModule
  ],
})
export class UsuarioModule {}
