import { Injectable } from '@nestjs/common';
import { CreateEstatusDto } from './dto/create-estatus.dto';
import { UpdateEstatusDto } from './dto/update-estatus.dto';
import { Repository } from 'typeorm';
import { Estatus } from '../../entities/Estatus';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EstatusService {
//#region Constructor
  constructor(
    @InjectRepository(Estatus)
    private readonly _estatusRepository:Repository<Estatus>,
  ) { }
//#endregion

//#region Servicios
  async getEstatusActivoId(): Promise<{estatusId: number}> {
    return await this._estatusRepository.findOne({
      where: {entidadId: 1, nombre: 'activo'},
      select: {estatusId:true}
    });
  }
//#endregion
}
