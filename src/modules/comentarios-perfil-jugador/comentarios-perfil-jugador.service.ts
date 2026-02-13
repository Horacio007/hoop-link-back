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
import { CloudinaryService } from '../../common/cloudinary/services/cloudinary.service';
import { FicherosService } from '../ficheros/ficheros.service';
import { HistorialTrabajosCoachService } from '../historial-trabajos-coach-service/historial-trabajos-coach-service.service';
import { MailService } from '../../common/mail/services/common.mail.service';

@Injectable()
export class ComentariosPerfilJugadorService {

//#region Constructor
  constructor(
    @InjectRepository(ComentariosPerfilJugador)
    private readonly _comentarioPerfilJugadorRepository:Repository<ComentariosPerfilJugador>,
    private readonly _errorService: ErrorHandleService,
    private readonly _informacionPersonalService: InformacionPersonalService,
    private readonly dataSource:DataSource,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _ficherosService: FicherosService,
    private readonly _mailService:MailService
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

      const perfilComentado: number = await this._informacionPersonalService.getUsuarioIdByInformacionPersonalId(informacionPersonalId);

      await this._comentarioPerfilJugadorRepository.save({
        autorComentarioId: usuarioCreacionId,
        perfilComentadoJugadorId: perfilComentado,
        autor: createComentariosPerfilJugadorDto.autor === 1,
        comentario: createComentariosPerfilJugadorDto.comentario,
        usuarioCreacion: usuarioCreacionId
      });

      if (createComentariosPerfilJugadorDto.autor === 1) // hay que mandar correo a los entrenadores
      {
        const listaCorreos = await this.getListadoCorreosByPerfilComentadoId(perfilComentado);
        const nombreJugador = await this.getNombreJugador(perfilComentado);
        await this._mailService.enviarCorreoAEntrenadoresComentarioDeJufgador(listaCorreos, nombreJugador);
      }
      else // mandar al jugador
      {
        const correoJugadoor = await this.getCorreoJugador(perfilComentado);
        await this._mailService.enviarCorreoaJugadorPorCoach(correoJugadoor);
      }

      const response:IResponse<any> = {
        statusCode: HttpStatus.CREATED,
        mensaje: 'Comentario registrado.',
      }
    
      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  private async getListadoCorreosByPerfilComentadoId(perfilId: number)
  {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const listadoCorreos = await queryRunner.query(`
        SELECT
        	uEntrenador.correo
        FROM comentarios_perfil_jugador cpj
        JOIN usuario u ON cpj.perfil_comentado_jugador_id=u.usuario_id
        JOIN usuario uEntrenador ON cpj.autor_comentario_id=uEntrenador.usuario_id
        WHERE u.estatus_id=1
        AND cpj.autor = 0
        AND cpj.perfil_comentado_jugador_id=${perfilId}
        GROUP BY uEntrenador.correo

      `);

      const toEmails = listadoCorreos.map(r => r.correo);
      console.log(toEmails);
      return toEmails;
    } catch (error) {
      await queryRunner.release();
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
    finally {
      await queryRunner.release();
    }
  }

  private async getNombreJugador(perfilId: number)
  {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const nombre = await queryRunner.query(`
       SELECT
        	concat(u.nombre, ' ', u.a_paterno, ' ', u.a_materno) AS nombre
        FROM informacion_personal ip
        JOIN usuario u ON ip.usuario_id=u.usuario_id
        WHERE u.usuario_id=${perfilId}
      `);

      return nombre[0]['nombre'];
    } catch (error) {
      await queryRunner.release();
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
    finally {
      await queryRunner.release();
    }
  }

  private async getCorreoJugador(perfilId: number)
  {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const nombre = await queryRunner.query(`
        SELECT
        	correo
        FROM usuario
        WHERE usuario_id=${perfilId}
      `);

      return nombre[0]['correo'];
    } catch (error) {
      await queryRunner.release();
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
    finally {
      await queryRunner.release();
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
        	CONCAT(uPerfil.nombre, COALESCE(CONCAT(' ', ip.alias), ''),' ', uPerfil.a_paterno, ' ', uPerfil.a_materno) AS nombre_perfil,
          uAutor.usuario_id AS autorId
        FROM comentarios_perfil_jugador cpj
        LEFT JOIN usuario uAutor ON cpj.autor_comentario_id=uAutor.usuario_id
        LEFT JOIN usuario uPerfil ON cpj.perfil_comentado_jugador_id=uPerfil.usuario_id
        LEFT JOIN informacion_personal ip ON uPerfil.usuario_id=ip.usuario_id
        WHERE ip.informacion_personal_id=${id}
        ORDER BY cpj.fecha_creacion DESC
      `);

      if (comentarios.length > 0) {
        for (const item of comentarios) {
          if (item.autor == 0) {
      
            const [row] = await queryRunner.query(`
              SELECT foto_perfil_id
              FROM informacion_personal_coach
              WHERE coach_id = ?
            `, [item.autorId]);
      
            // console.log('este es el valor del row', row);
            const fotoPerfilId = row?.foto_perfil_id;
      
            if (Number.isInteger(fotoPerfilId) && fotoPerfilId > 0) {
              // console.log('entre a la validacion chida');
              const publicId = await this._ficherosService.getPublicIdByFicheroId(fotoPerfilId);
              // console.log('este es el publicid', publicId);
              const fotoPerfilPublicId = await this._cloudinaryService.getImage(publicId);
              // console.log('este es el public id', fotoPerfilPublicId);
              item.fotoPerfilPublicUrl = fotoPerfilPublicId; 
            }
          }
        }
      }

     
      const response:IResponse<IComentarioPerfilJugador[]> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: comentarios
      }
      console.log(response);
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
