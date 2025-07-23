import { Injectable } from '@nestjs/common';
import { CreateLogrosClaveInformacionPersonalDto } from './dto/create-logros-clave-informacion-personal.dto';
import { UpdateLogrosClaveInformacionPersonalDto } from './dto/update-logros-clave-informacion-personal.dto';
import { LogrosClaveInformacionPersonal } from '../../entities/LogrosClaveInformacionPersonal';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { LogrosClaveDto } from '../informacion-personal/dto/logros-clave.dto';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { getRepo } from '../../common/helpers/database/repository.helper';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar: npm install uuid

@Injectable()
export class LogrosClaveInformacionPersonalService {
  
//#region Constructor
  constructor(
    @InjectRepository(LogrosClaveInformacionPersonal)
    private readonly _logrosClaveRepository:Repository<LogrosClaveInformacionPersonal>,
    private readonly _errorService: ErrorHandleService,
  ) { }
//#endregion

 async delete(informacionPersonalId:number, manager?: EntityManager) {
    const repo = getRepo(this._logrosClaveRepository, manager);
    try {
      await repo.delete({
        informacionPersonalId
      });
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async insert(informacionPersonalId:number, historialEventos: LogrosClaveDto[], manager?: EntityManager) {
    const repo = getRepo(this._logrosClaveRepository, manager);
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
    const repo = getRepo(this._logrosClaveRepository);
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
