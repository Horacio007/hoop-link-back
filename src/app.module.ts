import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { Entidad } from './entities/Entidad';
import { Estatus } from './entities/Estatus';
import { Permiso } from './entities/Permiso';
import { Rol } from './entities/Rol';
import { TipoUsuario } from './entities/TipoUsuario';
import { Usuario } from './entities/Usuario';
import { CatalogoModule } from './modules/catalogo/catalogo.module';
import { Estado } from './entities/Estado';
import { Municipio } from './entities/Municipio';
import { EstatusBusquedaJugador } from './entities/EstatusBusquedaJugador';
import { Ficheros } from './entities/Ficheros';
import { InformacionPersonal } from './entities/InformacionPersonal';
import { InformacionPersonalModule } from './modules/informacion-personal/informacion-personal.module';
import { EstatusModule } from './modules/estatus/estatus.module';
import { FicherosModule } from './modules/ficheros/ficheros.module';


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
        Municipio,
        EstatusBusquedaJugador,
        Ficheros,
        InformacionPersonal
      ]
    }),
    AuthModule,
    UsuarioModule,
    CatalogoModule,
    InformacionPersonalModule,
    EstatusModule,
    FicherosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
