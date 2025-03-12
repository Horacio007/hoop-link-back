import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { ErrorHandleService } from '../../common/error/common.error-handle.service';
import { TypeError } from '../../common/enums/errors/common.error-handle.enum';
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Usuario)
        private readonly userRepository:Repository<Usuario>,
        configService:ConfigService,
        private readonly errorHandleService:ErrorHandleService
    ) {
        super({
            secretOrKey: configService.get('jwtPrivateKey'),
            jwtFromRequest: ExtractJwt.fromHeader("x-auth-token"),
        })
    }

    // async validate(payload:JwtPayload): Promise<Usuario> {
    //     // const {nombre, usuario} = payload;
    //     // const user = await this.userRepository.findOne({
    //     //     where: {nombre, usuario},
    //     //     select:{id:true, nombre:true, usuario:true, password: true}
    //     // });

    //     // if (!user) this.errorHandleService.errorHandle('Token not valid.', TypeError.UnauthorizedException);

    //     // return user;
    // }
}