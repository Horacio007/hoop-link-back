import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ErrorHandleService } from '../../../common/error/common.error-handle.service';
import { ErrorMethods } from '../../../common/enums/errors/common.error-handle.enum';

@Injectable()
export class AccessTokenGuard2  implements CanActivate {
  constructor(private jwtService: JwtService, private errorHandleService: ErrorHandleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.cookies?.['accessToken']; // O usa el header si lo manejas así
  
      if (!token) this.errorHandleService.errorHandle('No token.', ErrorMethods.UnauthorizedException);
  
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload; // Guardamos el payload para usarlo luego
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
