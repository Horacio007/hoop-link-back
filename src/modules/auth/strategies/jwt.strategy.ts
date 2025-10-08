import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Usuario } from "../../../entities/Usuario";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { ErrorHandleService } from '../../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../../common/error/enum/common.error-handle.enum';
import { Injectable } from "@nestjs/common";
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        @InjectRepository(Usuario)
        private readonly userRepository:Repository<Usuario>,
        configService:ConfigService,
        private readonly errorHandleService:ErrorHandleService
    ) {
        super({
            secretOrKey: configService.get('JWT_PRIVATE_KEY'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // <<< ahora se extrae del header
            ignoreExpiration: false,
        })
    }

    async validate(payload:JwtPayload): Promise<Usuario> {
        const {nombre, id} = payload;
        const user = await this.userRepository.findOne({
            where: {nombre, usuarioId: +id},
            select:{usuarioId:true, nombre:true}
        });

        if (!user) this.errorHandleService.errorHandle('Token not valid.', ErrorMethods.UnauthorizedException);

        return user;
    }
}