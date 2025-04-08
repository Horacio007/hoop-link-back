import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { Entidad } from './entities/Entidad';
import { Estatus } from './entities/Estatus';
import { Permiso } from './entities/Permiso';
import { Rol } from './entities/Rol';
import { TipoUsuario } from './entities/TipoUsuario';
import { Usuario } from './entities/Usuario';
import { CatalogoModule } from './catalogo/catalogo.module';
import { Estado } from './entities/Estado';
import { Municipio } from './entities/Municipio';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        Entidad,
        Estatus,
        Permiso,
        Rol,
        TipoUsuario,
        Usuario,
        Estado,
        Municipio
      ]
    }),
    AuthModule,
    UsuarioModule,
    CatalogoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
