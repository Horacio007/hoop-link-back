import { HttpStatus, Injectable } from '@nestjs/common';
import { UpsertInformacionPersonalDto } from './dto/upsert-informacion-personal.dto';
import { InformacionPersonal } from '../../entities/InformacionPersonal';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { CloudinaryService } from '../../common/cloudinary/services/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { Ficheros } from '../../entities/Ficheros';
import { FicherosService } from '../ficheros/ficheros.service';
import { info } from 'console';
import { IResponse } from '../../common/interfaces';

@Injectable()
export class InformacionPersonalService {
//#region Constructor
  constructor(
    @InjectRepository(InformacionPersonal)
    private readonly _informacionPersonalRepository:Repository<InformacionPersonal>,
    private readonly _ficherosService: FicherosService,
    private readonly _errorService: ErrorHandleService,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _dataSource: DataSource
  ) { }
//#endregion

//#region Servicios
  async save(usuarioId:number, dto: UpsertInformacionPersonalDto, fotoPerfil?: Express.Multer.File) {
    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let fotoPerfilResponse: UploadApiResponse;
      let ficheroFotoPerfil: Ficheros;

      // primero guardo foto perfil
      if (fotoPerfil) {
        fotoPerfilResponse = await this._cloudinaryService.uploadFile(fotoPerfil);
        ficheroFotoPerfil = await this._ficherosService.uploadFotoPerfil(usuarioId, fotoPerfilResponse, dto.perfil.fotoPerfilId, queryRunner.manager);
      }
      
      const existing = await this._informacionPersonalRepository.findOneBy({ usuarioId });
      if (existing) {
        // actualizo
      } else {
        // nuevo
        const infoRepo = queryRunner.manager.getRepository(InformacionPersonal);

        const { perfil } = dto;
        const newInfoPersonal = {
          usuarioId,
          fotoPerfilId: ficheroFotoPerfil.ficheroId ? ficheroFotoPerfil.ficheroId : null,
          altura: perfil.altura,
          peso: perfil.peso,
          estatusBusquedaJugadorId: +perfil.estatusBusquedaJugador.id,
          medidaMano: perfil.medidaMano,
          largoBrazo: perfil.largoBrazo,
          quienEres: perfil.quienEres,
          usuarioCreacion: usuarioId
        }
      
        await infoRepo.create(newInfoPersonal);
        await infoRepo.save(newInfoPersonal);
      }

      await queryRunner.commitTransaction();

      const response:IResponse<any> = {
        statusCode: HttpStatus.CREATED,
        mensaje: 'Información actualizada.',
      }
  
      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    } finally {
      await queryRunner.release();
    }
  }

  async getInformacionPersonal(usuarioId: number) {
    
  }
//#endregion

}
