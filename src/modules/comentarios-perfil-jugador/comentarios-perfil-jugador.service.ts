import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateComentariosPerfilJugadorDto } from './dto/create-comentarios-perfil-jugador.dto';
import { UpdateComentariosPerfilJugadorDto } from './dto/update-comentarios-perfil-jugador.dto';
import { ComentariosPerfilJugador } from '../../entities/ComentariosPerfilJugador';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { IResponse } from '../../common/interfaces/responses/response';
import { InformacionPersonalService } from '../informacion-personal/informacion-personal.service';
import { IComentarioPerfilJugador } from './interfaces/comentario-perfil-jugador.interface';

@Injectable()
export class ComentariosPerfilJugadorService {

//#region Constructor
  constructor(
    @InjectRepository(ComentariosPerfilJugador)
    private readonly _comentarioPerfilJugadorRepository:Repository<ComentariosPerfilJugador>,
    private readonly _errorService: ErrorHandleService,
    private readonly _informacionPersonalService: InformacionPersonalService,
    private readonly dataSource:DataSource,
  ) { }
//#endregion

//#region Servicios
  async create(usuarioCreacionId: number, createComentariosPerfilJugadorDto: CreateComentariosPerfilJugadorDto) {
    try {

      let informacionPersonalId: number = 0;
      // si no viene el id de info personal quiere decir que es un comentario propio
      if (createComentariosPerfilJugadorDto.informacionPersonalId > 0) {
        informacionPersonalId = createComentariosPerfilJugadorDto.informacionPersonalId;
      } else {
        informacionPersonalId = await this._informacionPersonalService.getInformacionPersonalIdByUsuarioId(usuarioCreacionId);
      }

      await this._comentarioPerfilJugadorRepository.save({
        autorComentarioId: usuarioCreacionId,
        perfilComentadoJugadorId: informacionPersonalId,
        autor: createComentariosPerfilJugadorDto.autor === 1,
        comentario: createComentariosPerfilJugadorDto.comentario,
        usuarioCreacion: usuarioCreacionId
      });


      const response:IResponse<any> = {
        statusCode: HttpStatus.CREATED,
        mensaje: 'Comentario registrado.',
      }
    
      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async findAll(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const comentarios: IComentarioPerfilJugador[] = await queryRunner.query(`
        SELECT
        	cpj.comentarios_perfil_jugador_id,
        	(cpj.autor + 0) AS autor,
        	cpj.comentario,
        	cpj.fecha_creacion,
        	CONCAT(uAutor.nombre, ' ', uAutor.a_paterno, ' ', uAutor.a_materno) AS nombre_autor,
        	CONCAT(uPerfil.nombre, COALESCE(CONCAT(' ', ip.alias), ''),' ', uPerfil.a_paterno, ' ', uPerfil.a_materno) AS nombre_perfil
        FROM informacion_personal ip
        JOIN comentarios_perfil_jugador cpj ON ip.informacion_personal_id=cpj.perfil_comentado_jugador_id
        LEFT JOIN usuario uAutor ON cpj.autor_comentario_id=uAutor.usuario_id
        LEFT JOIN usuario uPerfil ON ip.usuario_id=uPerfil.usuario_id
        WHERE ip.informacion_personal_id=${id}
        ORDER BY cpj.fecha_creacion DESC
      `);
     
      const response:IResponse<IComentarioPerfilJugador[]> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: comentarios
      }

      return response;
    } catch (error) {
      await queryRunner.release();
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
    finally {
      await queryRunner.release();
    }
  }

//#endregion
}
