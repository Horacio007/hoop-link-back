import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { AccessTokenGuard } from '../auth/guard/auth/access-token.guard';
import { User } from '../../common/decorators/user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { IResponse } from '../../common/interfaces';
import { UpsertInformacionPersonalDto } from './dto/upsert-informacion-personal.dto';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService, private readonly _errorService: ErrorHandleService) {}

  @Get('list-all-jugadores')
  @UseGuards(AccessTokenGuard)
  async findAll(@User() user: JwtPayload,) {
    return await this.coachService.findAll(+user.id);
  }

  @Post('save-vista-perfil/:id')
  @UseGuards(AccessTokenGuard)
  async saveVistaPerfil(
    @User() user: JwtPayload,
    @Param('id') informacionPersonalId: number
  ) {
    return await this.coachService.saveVistaPerfil(+user.id, informacionPersonalId);
  }

  @Post('save-favorito-perfil/:id')
  @UseGuards(AccessTokenGuard)
  async saveFavoritoPerfil(
    @User() user: JwtPayload,
    @Param('id') informacionPersonalId: number
  ) {
    return await this.coachService.saveFavoritoPerfil(+user.id, informacionPersonalId);
  }

  @Get('list-all-jugadores-favoritos')
  @UseGuards(AccessTokenGuard)
  async findAllFavoritos(@User() user: JwtPayload,) {
    return await this.coachService.findAllFavoritos(+user.id);
  }

  @Get('total-favoritos')
  @UseGuards(AccessTokenGuard)
  async getTotalFavoritosPerfil(@User() user: JwtPayload,) {
    return await this.coachService.getTotalFavoritosPerfil(+user.id);
  }

  @Post('save')
  @UseGuards(AccessTokenGuard) 
  @UseInterceptors(FileInterceptor('fotoPerfil'))
  async saveInformacionPersonal(
    @UploadedFile() fotoPerfil: Express.Multer.File,
    @Body('datos') datosJson: string,
    @User() user: JwtPayload
  ): Promise<IResponse<any>> {
    try {
        console.log(user);
      // Convertir string JSON a objeto
      let dto: UpsertInformacionPersonalDto;
      dto = JSON.parse(datosJson);
  
      // Convertir plano a instancia con decoradores
      const dtoInstance = plainToInstance(UpsertInformacionPersonalDto, dto);
  
      // Validar manualmente
      await validateOrReject(dtoInstance);
          
      return this.coachService.save(+user.id, dto, fotoPerfil);
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
    
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getInformacionPersonal(@User() user: JwtPayload) {
    return await this.coachService.getInformacionPersonal(+user.id);
  }

}
