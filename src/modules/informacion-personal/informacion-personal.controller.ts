import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Req, Query } from '@nestjs/common';
import { InformacionPersonalService } from './informacion-personal.service';
import { UpsertInformacionPersonalDto } from './dto/upsert-informacion-personal.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { error } from 'console';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import { User } from '../../common/decorators/user.decorator';
import { AccessTokenGuard } from '../auth/guard/auth/access-token.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { IResponse } from '../../common/interfaces';

@Controller('informacion-personal')
export class InformacionPersonalController {
//#region Constructor
  constructor(
    private readonly _informacionPersonalService: InformacionPersonalService,
    private readonly _errorService: ErrorHandleService
  ) {}
//#endregion

//#region Servicios
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
          
      return this._informacionPersonalService.save(+user.id, dto, fotoPerfil);
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
   
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getInformacionPersonal(@User() user: JwtPayload) {
    return await this._informacionPersonalService.getInformacionPersonal(+user.id);
  }

  @Post('upload-video/:tipo/:id?')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AccessTokenGuard)
  async uploadVideo(
    @User() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Param('tipo') tipo: string,
    @Query('id') id?: number,
  ) {
    return await this._informacionPersonalService.uploadVideo(+user.id, file, +id, tipo);
  }
//#endregion
}
