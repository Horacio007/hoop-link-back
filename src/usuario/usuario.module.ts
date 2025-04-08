import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { CommonModule } from '../common/common.module';
import { Usuario } from '../entities/Usuario';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estatus } from '../entities/Estatus';
import { Municipio } from '../entities/Municipio';
import { TipoUsuario } from '../entities/TipoUsuario';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, AuthService],
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Estatus,
      Municipio,
      TipoUsuario
    ]),
    CommonModule,
    AuthModule
  ],
})
export class UsuarioModule {}
