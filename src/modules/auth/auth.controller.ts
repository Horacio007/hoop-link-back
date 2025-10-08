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
import { ITokens } from './interfaces/tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly errorHandleService: ErrorHandleService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDTO): Promise<IResponse<ITokens>> {  

    const tokens = await this.authService.login(loginUserDto);

    return {
      statusCode: 200,
      mensaje:'ok',
      data: tokens
    };
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<IResponse<ITokens>> {
    
    if (!refreshToken) this.errorHandleService.errorHandle('No refresh token', ErrorMethods.UnauthorizedException);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.authService.refreshToken(refreshToken);


    return {
      statusCode: 200,
      mensaje:'ok',
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken
      }
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string): Promise<IResponse<any>> {
    
    await this.authService.logout(refreshToken);

    return {
      statusCode: 200,
      mensaje:'Logout exitoso'
    };
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
