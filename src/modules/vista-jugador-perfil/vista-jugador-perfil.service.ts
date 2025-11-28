import { Injectable } from '@nestjs/common';
import { VistaJugadorPerfil } from '../../entities/VistaJugadorPerfil';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';

@Injectable()
export class VistaJugadorPerfilService {

//#region Constructor
  constructor(
    @InjectRepository(VistaJugadorPerfil)
    private readonly _vistaJugadorPerfilRepository:Repository<VistaJugadorPerfil>,
    private readonly _errorService: ErrorHandleService,
  ) { }
//#endregion

//#region Servicios

  async existeVista(coachId: number, jugadorId: number) {
    try {
      const existe = await this._vistaJugadorPerfilRepository.find({
        where: [
          {entrenadorId: coachId},
          {jugadorId: jugadorId}
        ]
      });

      return existe.length == 0 ? false : true;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async insertaVista(coachId: number, jugadorId: number) {
    try {
      await this._vistaJugadorPerfilRepository.save({
        entrenadorId: coachId,
        jugadorId
      }); // ← no olvides guardar
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

//#endregion

}
