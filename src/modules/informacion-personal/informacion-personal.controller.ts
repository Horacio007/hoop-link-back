import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Req } from '@nestjs/common';
import { InformacionPersonalService } from './informacion-personal.service';
import { UpsertInformacionPersonalDto } from './dto/upsert-informacion-personal.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { error } from 'console';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
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
    console.log(user);
    // Convertir string JSON a objeto
    let dto: UpsertInformacionPersonalDto;
    try {
      dto = JSON.parse(datosJson);
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }

    // Convertir plano a instancia con decoradores
    const dtoInstance = plainToInstance(UpsertInformacionPersonalDto, dto);

    // Validar manualmente
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      this._errorService.errorHandle(errors.toString(), ErrorMethods.BadRequestException);
    }
    
    return this._informacionPersonalService.save(+user.id, dto, fotoPerfil);
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getInformacionPersonal(@User() user: JwtPayload) {
    return await this._informacionPersonalService.getInformacionPersonal(+user.id);
  }
//#endregion
}
