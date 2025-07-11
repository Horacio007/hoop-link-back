import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/Usuario';
import { DataSource, Repository } from 'typeorm';
import { LoginUserDTO } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { ErrorHandleService } from '../common/error/common.error-handle.service';
import { ErrorMethods } from '../common/enums/errors/common.error-handle.enum';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';
import { IAuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly errorHandle: ErrorHandleService,
    private readonly jwtService:JwtService,
    private readonly dataSource:DataSource
  ) {  }

  async login(loginDto: LoginUserDTO) {
    const {contrasena, correo} = loginDto;

    const user = await this.usuarioRepository.findOne({
      where : {correo, estatusId: 1},
      select: {usuarioId:true, nombre:true, correo:true, contrasena: true}
    });

    if (!user || !bcrypt.compareSync(contrasena, user.contrasena)) this.errorHandle.errorHandle('Credenciales invalidas, Usuario o Contraseña erroneas.', ErrorMethods.UnauthorizedException);

    return {
      token: await this.getJwtToken({id: user.usuarioId.toString(), nombre: user.nombre, usuario: user.correo}),
      refreshtoken: await this.getJwtRefreshToken({id: user.usuarioId.toString(), nombre: user.nombre, usuario: user.correo})
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_REFRESH_KEY
      });
  
      // Generar nuevo access token
      const newAccessToken = await this.jwtService.signAsync(
        { id: payload.id, nombre: payload.nombre, usuario: payload.usuario },
        { secret: process.env.JWT_PRIVATE_KEY, expiresIn: '2h' }
      );
  
      // Generar nuevo refresh token
      const newRefreshToken = await this.jwtService.signAsync(
        { id: payload.id, nombre: payload.nombre, usuario: payload.usuario },
        { secret: process.env.JWT_REFRESH_KEY, expiresIn: '1d' } // Puedes ajustar el tiempo de expiración según lo necesites
      );
  
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  
    } catch (error) {
      this.errorHandle.errorHandle('Refresh token inválido o expirado.', ErrorMethods.UnauthorizedException);
    }
  }
  
  

  public async getJwtToken(payload: JwtPayload) {
    return await this.jwtService.sign(payload);
  }

  public async getJwtRefreshToken(payload: JwtPayload) {
    return await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: '1d' // token largo
    });
  }

  public async validaToken(token:string) {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_PRIVATE_KEY
    });
  }
  
  public async yopli(payload: JwtPayload) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const user: IAuthUser = await queryRunner.query(`
          select
            u.usuario_id as id,
            u.nombre,
            u.correo,
            r.nombre as rol
          from usuario u
          join tipo_usuario tu on u.tipo_usuario_id=tu.tipo_usuario_id
          join rol r on tu.rol_id=r.rol_id
          where u.estatus_id = 1
          and u.usuario_id = ${payload.id}
          and u.nombre = '${payload.nombre}'
          and u.correo = '${payload.usuario}'
        `);

        console.log(user);
      return user[0];
    } catch (error) {
      await queryRunner.release();
      this.errorHandle.errorHandle(error, ErrorMethods.BadRequestException);
    }
    finally {
      await queryRunner.release();
    }
  }

}
