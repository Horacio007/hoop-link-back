import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../../entities/Usuario';
import { DataSource, Repository } from 'typeorm';
import { LoginUserDTO } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';
import { IAuthUser } from './interfaces/auth-user.interface';
import { RefreshTokens } from '../../entities/RefreshTokens';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly errorHandle: ErrorHandleService,
    private readonly jwtService:JwtService,
    private readonly dataSource:DataSource,
    @InjectRepository(RefreshTokens)
    private readonly refreshTokenRepo: Repository<RefreshTokens>,
  ) {  }

  async login(loginDto: LoginUserDTO) {
    const {contrasena, correo} = loginDto;

    const user = await this.usuarioRepository.findOne({
      where : {correo, estatusId: 1},
      select: {usuarioId:true, nombre:true, correo:true, contrasena: true}
    });

    if (!user || !bcrypt.compareSync(contrasena, user.contrasena)) this.errorHandle.errorHandle('Credenciales invalidas, Usuario o Contraseña erroneas.', ErrorMethods.UnauthorizedException);

    const token: string = await this.getJwtToken({id: user.usuarioId.toString(), nombre: user.nombre, usuario: user.correo});
    const refreshToken: string = await this.getJwtRefreshToken({id: user.usuarioId.toString(), nombre: user.nombre, usuario: user.correo})

    // Después de generar refreshToken en login
    const refreshTokenEntity = this.refreshTokenRepo.create({
      token: refreshToken,
      usuarioId: user.usuarioId,  // asumiendo que tienes relación Usuario -> RefreshTokens
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días
      revoked: false
    });
    await this.refreshTokenRepo.save(refreshTokenEntity);

    return {
      token,
      refreshToken 
    };
  }

  async logout(refreshToken: string) {
    const stored = await this.refreshTokenRepo.findOne({ where: { token: refreshToken } });
    if (stored) {
      stored.revoked = true;
      await this.refreshTokenRepo.save(stored);
    }
    return { message: 'Logout exitoso' };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_REFRESH_KEY
      });

      const stored = await this.refreshTokenRepo.findOne({ where: { token } });
      if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        this.errorHandle.errorHandle('Refresh token inválido o expirado.', ErrorMethods.UnauthorizedException);
      }
      
      // Revocar el token viejo
      stored.revoked = true;
      await this.refreshTokenRepo.save(stored);
  
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

      const newRefreshTokenEntity = this.refreshTokenRepo.create({
        token: newRefreshToken,
        usuarioId: stored.usuarioId,
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        revoked: false
      });
      await this.refreshTokenRepo.save(newRefreshTokenEntity);
  
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  
    } catch (error) {
      this.errorHandle.errorHandle('Refresh token inválido o expirado.', ErrorMethods.UnauthorizedException);
    }
  }
  
  

  public async getJwtToken(payload: JwtPayload) {
    return await this.jwtService.sign(payload, { secret: process.env.JWT_PRIVATE_KEY, expiresIn: '2h' });
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
            case
              when r.nombre = 'escuela coach' then 'coach'
              when r.nombre = 'club coach' then 'coach'
              else r.nombre
            end as rol
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
