import { Injectable } from '@nestjs/common';
import { FavoritosJugadoresCoach } from '../../entities/FavoritosJugadoresCoach';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';

@Injectable()
export class FavoritosJugadoresCoachService {

//#region Constructor
 constructor(
    @InjectRepository(FavoritosJugadoresCoach)
    private readonly _favoritosJugadoresCoachRepository:Repository<FavoritosJugadoresCoach>,
    private readonly _errorService: ErrorHandleService,
  ) { }
//#endregion

//#region Servicios

 async existeFavorito(coachId: number, jugadorId: number) {
    try {
      const existe = await this._favoritosJugadoresCoachRepository.find({
        where: {
          coachId  : coachId,
          jugadorId: jugadorId
        },
      });

      return existe.length == 0 ? false : true;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getFavorito(coachId: number, jugadorId: number) {
    try {
      const existe = await this._favoritosJugadoresCoachRepository.find({
        where: {
          coachId  : coachId,
          jugadorId: jugadorId
        },
      });

      return existe[0];
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async insertFavorito(coachId: number, jugadorId: number) {
    try {
      await this._favoritosJugadoresCoachRepository.save({
        coachId,
        jugadorId,
        usuarioCreacion: coachId
      }); // ← no olvides guardar
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async updateFavorito(coachId: number, jugadorId: number) {
    try {

      const favorito = await this.getFavorito(coachId, jugadorId);

      await this._favoritosJugadoresCoachRepository.update(
        { coachId, jugadorId },  // ← condición WHERE
        {
          interesado: !(favorito.interesado[0] !== 0),      // o 0 si quieres
          usuarioEdicion: coachId,
          fechaEdicion: new Date(),
        }
      );
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getTotalFavoritosPerfil(jugadorId: number) {
    try {
      console.log('JugadorId recibido:', jugadorId, typeof jugadorId);

      const total = await this._favoritosJugadoresCoachRepository.find({
        where: {
          jugadorId: jugadorId,
          interesado: true
        }
      });

      return total.length;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }
  
//#endregion
}
