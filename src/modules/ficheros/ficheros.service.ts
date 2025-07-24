import { Injectable } from '@nestjs/common';
import { CreateFicheroDto } from './dto/create-fichero.dto';
import { UpdateFicheroDto } from './dto/update-fichero.dto';
import { Ficheros } from '../../entities/Ficheros';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { UploadApiResponse } from 'cloudinary';
import { EstatusService } from '../estatus/estatus.service';
import { RoutesPathsClodudinary } from '../../common/cloudinary/constants/route-paths.const';
import { getRepo } from '../../common/helpers/database/repository.helper';
import { CloudinaryService } from '../../common/cloudinary/services/cloudinary.service';

@Injectable()
export class FicherosService {
//#region Constructor
  constructor(
    @InjectRepository(Ficheros)
    private readonly _ficheroRepository:Repository<Ficheros>,
    private readonly _errorService: ErrorHandleService,
    private readonly _estatusService:EstatusService,
    private readonly _cloudinaryService:CloudinaryService,
  ) { }
//#endregion

  async uploadFichero(usuarioId: number, uploaded: UploadApiResponse, ficheroId: number, ruta:string, manager?: EntityManager, resourceType: "image" | "video" | "raw" | "auto" = "image"): Promise<Ficheros> {
    const repo = getRepo(this._ficheroRepository, manager);
    try {

      if (isNaN(ficheroId)) {
        ficheroId = 0;
      }
      const existing = await this._ficheroRepository.findOneBy({ ficheroId });
      console.log('aqui el antes del insert',existing);
      if (existing) {
        // primero elimino la foto anterior para no tener registros innecesarios
        console.log('id anterior de la imagen:', existing.archivoId);
        await this._cloudinaryService.destroy(existing.archivoId, resourceType)

        // se hace un update
        existing.nombre = uploaded.original_filename;
        existing.archivoId = uploaded.public_id;
        existing.fechaEdicion = new Date();
        existing.usuarioEdicion = usuarioId;
        return await repo.save(existing);
      } else {
        // insert
        const estatusId = await this._estatusService.getEstatusActivoId();
        const newFichero = repo.create({
          estatusId,
          usuarioId,
          nombre: uploaded.original_filename,
          folderId: ruta,
          archivoId: uploaded.public_id,
          usuarioCreacion: usuarioId
        });

        await repo.create(newFichero);
        return await repo.save(newFichero);
      }
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getPublicIdByFicheroId(ficheroId: number): Promise<string> {
    const fichero = await this._ficheroRepository.findOne({
      where: {ficheroId},
      select: {
        archivoId: true
      }
    });

    return fichero.archivoId;
  }
}
