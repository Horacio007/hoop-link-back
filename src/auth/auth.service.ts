import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/Usuario';
import { Repository } from 'typeorm';
import { LoginUserDTO } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { ErrorHandleService } from '../common/error/common.error-handle.service';
import { ErrorMethods } from '../common/enums/errors/common.error-handle.enum';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly errorHandle: ErrorHandleService,
    private readonly jwtService:JwtService
  ) {  }

  async login(loginDto: LoginUserDTO) {
    // const {password, usuario} = loginDto;
    
    // const user = await this.usuarioRepository.findOne({
    //   where : {usuario},
    //   select: {id:true, nombre:true, usuario:true, password: true}
    // });

    // if (!user || !bcrypt.compareSync(password, user.password)) this.errorHandle.errorHandle('Credentials not valid, Password or Email wrong.', TypeError.UnauthorizedException);

    // return {
    //   token: this.getJwtToken({id: user.id, nombre: user.nombre, usuario: user.usuario})
    // };
  }

  public async getJwtToken(payload: JwtPayload) {
    return await this.jwtService.sign(payload);
  }

  public async validaToken(token:string) {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_PRIVATE_KEY
    });
  }
  

}
