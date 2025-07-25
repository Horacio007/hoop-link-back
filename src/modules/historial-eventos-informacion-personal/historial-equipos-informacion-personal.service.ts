import { Injectable } from '@nestjs/common';
import { HistorialEquiposInformacionPersonal } from './../../entities/HistorialEquiposInformacionPersonal';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { getRepo } from '../../common/helpers/database/repository.helper';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { HistorialEquiposDto } from '../informacion-personal/dto/historial-equipos.dto';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar: npm install uuid

@Injectable()
export class HistorialEquiposInformacionPersonalService {
  
//#region Constructor
  constructor(
    @InjectRepository(HistorialEquiposInformacionPersonal)
    private readonly _historialEquiposRepository:Repository<HistorialEquiposInformacionPersonal>,
    private readonly _errorService: ErrorHandleService,
  ) { }
//#endregion

  async delete(informacionPersonalId:number, manager?: EntityManager) {
    const repo = getRepo(this._historialEquiposRepository, manager);
    try {
      await repo.delete({
        informacionPersonalId
      });
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async insert(informacionPersonalId:number, historialEquipos: HistorialEquiposDto[], manager?: EntityManager) {
    const repo = getRepo(this._historialEquiposRepository, manager);
    try {
      const historial = historialEquipos.map(dto => 
        repo.create({
          nombre: dto.nombre,
          informacionPersonalId,
        })
      );

      await repo.save(historial); // ← no olvides guardar
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getAll(informacionPersonalId:number) {
    const repo = getRepo(this._historialEquiposRepository);
    try {
      const historial = await repo.findBy({
        informacionPersonalId
      });

      return historial.map(entiti => {
        return {
          id: uuidv4(),
          nombre: entiti.nombre
        }
      });
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

}
