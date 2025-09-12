import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UnauthorizedException, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { Response, Request } from 'express'; // ✅ no desde @nestjs/common
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { AccessTokenGuard } from './guard/auth/access-token.guard';
import { IResponse } from '../../common/interfaces/responses/response';
import { Usuario } from '../../entities/Usuario';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../common/decorators/user.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { IAuthUser } from './interfaces/auth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly errorHandleService: ErrorHandleService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDTO, @Res({ passthrough: true }) res: Response) {
    
    const { token, refreshtoken } = await this.authService.login(loginUserDto);
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: '.hooplink2.com', // 👈 dominio del frontend
      path: '/',
      maxAge: 1000 * 60 * 120
    });
  
    res.cookie('refreshToken', refreshtoken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: '.hooplink2.com', // 👈 dominio del frontend
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 2
    });

    return { success: true };
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token) this.errorHandleService.errorHandle('No refresh token', ErrorMethods.UnauthorizedException);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.authService.refreshToken(token);
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 120 // 120 minutos
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 2 // 2 días
    });

    return { success: true };
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProd,
     sameSite: isProd ? 'none' : 'strict',
      path: '/', // o el path que usaste al setearlo
    });
  
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
     sameSite: isProd ? 'none' : 'strict',
      path: '/', // asegúrate que coincida con el original
    });
  
    // (Opcional) puedes invalidar el refreshToken si lo guardas en base de datos/cache
  
    return { message: 'Logout exitoso' };
  }  

  @UseGuards(AccessTokenGuard) 
  @Get('yopli')
  @HttpCode(HttpStatus.OK)
  async yopli(@User() user: JwtPayload): Promise<IResponse<IAuthUser>> {
    const userA = await this.authService.yopli(user);

    return {
      statusCode:200,
      mensaje:'ok',
      data: userA
    };
  }

}
