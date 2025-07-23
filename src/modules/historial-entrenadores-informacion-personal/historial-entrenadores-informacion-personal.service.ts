import { Injectable } from '@nestjs/common';
import { CreateHistorialEntrenadoresInformacionPersonalDto } from './dto/create-historial-entrenadores-informacion-personal.dto';
import { UpdateHistorialEntrenadoresInformacionPersonalDto } from './dto/update-historial-entrenadores-informacion-personal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { HistorialEntrenadoresInformacionPersonal } from '../../entities/HistorialEntrenadoresInformacionPersonal';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { getRepo } from '../../common/helpers/database/repository.helper';
import { HistorialEntrenadoresDto } from '../informacion-personal/dto/historial-entrenadores.dto';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar: npm install uuid

@Injectable()
export class HistorialEntrenadoresInformacionPersonalService {

//#region Constructor
  constructor(
    @InjectRepository(HistorialEntrenadoresInformacionPersonal)
    private readonly _historialEntrenadoresRepository:Repository<HistorialEntrenadoresInformacionPersonal>,
    private readonly _errorService: ErrorHandleService,
  ) { }
//#endregion
  
  async delete(informacionPersonalId:number, manager?: EntityManager) {
    const repo = getRepo(this._historialEntrenadoresRepository, manager);
    try {
      await repo.delete({
        informacionPersonalId
      });
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async insert(informacionPersonalId:number, historialEventos: HistorialEntrenadoresDto[], manager?: EntityManager) {
    const repo = getRepo(this._historialEntrenadoresRepository, manager);
    try {
      const historial = historialEventos.map(dto => 
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
    const repo = getRepo(this._historialEntrenadoresRepository);
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
