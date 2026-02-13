import { Injectable } from '@nestjs/common';
import { CreateHistorialTrabajosCoachServiceDto } from './dto/create-historial-trabajos-coach-service.dto';
import { UpdateHistorialTrabajosCoachServiceDto } from './dto/update-historial-trabajos-coach-service.dto';
import { HistorialTrabajoCoach } from '../../entities/HistorialTrabajoCoach';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { getRepo } from '../../common/helpers/database/repository.helper';
import { HistorialEquiposDto } from '../informacion-personal/dto/historial-equipos.dto';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar: npm install uuid

@Injectable()
export class HistorialTrabajosCoachService {
//#region Constructor
  constructor(
    @InjectRepository(HistorialTrabajoCoach)
    private readonly _historialEquiposRepository:Repository<HistorialTrabajoCoach>,
    private readonly _errorService: ErrorHandleService,
  ) { }
//#endregion

  async delete(informacionPersonalId:number, manager?: EntityManager) {
    const repo = getRepo(this._historialEquiposRepository, manager);
    try {
      await repo.delete({
        informacionPersonalCoachId: informacionPersonalId
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
          informacionPersonalCoachId: informacionPersonalId,
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
        informacionPersonalCoachId: informacionPersonalId
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
