import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/Usuario';
import { CommonModule } from '../common/common.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenGuard } from './guard/auth/access-token.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AccessTokenGuard],
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [
        ConfigModule
      ],
      inject: [
        ConfigService
      ],
      useFactory:(configService:ConfigService) => {
        return {
          secret: configService.get('JWT_PRIVATE_KEY'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      },
    }),
    CommonModule,
    ConfigModule
  ],
  exports:[TypeOrmModule, JwtStrategy, PassportModule, JwtModule, AccessTokenGuard]
})
export class AuthModule {}
