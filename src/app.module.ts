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


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.host,
      port: +process.env.DB_PORT,
      database: process.env.database,
      username: process.env.user,
      password: process.env.password,
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        Entidad,
        Estatus,
        Permiso,
        Rol,
        TipoUsuario,
        Usuario
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
