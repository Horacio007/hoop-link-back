import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MetadataAlreadyExistsError, Repository } from 'typeorm';
import { InformacionPersonal } from '../../entities/InformacionPersonal';
import { CloudinaryService } from '../../common/cloudinary/services/cloudinary.service';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { FicherosService } from '../ficheros/ficheros.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { CatalogoService } from '../catalogo/catalogo.service';
import { IResponse } from '../../common/interfaces';
import { IInformacionPersonal } from '../../common/interfaces/informacion-personal/informacion-personal.interface';
import { IListadoJugadores } from './interfaces/listado-jugadores.interface';
import { VistaJugadorPerfilService } from '../vista-jugador-perfil/vista-jugador-perfil.service';
import { InformacionPersonalService } from '../informacion-personal/informacion-personal.service';
import { FavoritosJugadoresCoachService } from '../favoritos-jugadores-coach/favoritos-jugadores-coach.service';
import { UpsertInformacionPersonalDto } from './dto/upsert-informacion-personal.dto';
import { InformacionPersonalCoach } from '../../entities/InformacionPersonalCoach';
import { UploadApiResponse } from 'cloudinary';
import { RoutesPathsClodudinary } from '../../common/cloudinary/constants/route-paths.const';
import { Ficheros } from '../../entities/Ficheros';
import { AuditLogService } from '../audit-log/audit-log.service';
import { HistorialTrabajosCoachService } from '../historial-trabajos-coach-service/historial-trabajos-coach-service.service';
import { IInformacionPersonalCoach } from './interfaces/informacion-personal.interface';
import { MailService } from '../../common/mail/services/common.mail.service';
import { IRequestEmail } from '../../common/mail/interfaces';

@Injectable()
export class CoachService {
//#region Constructor
  constructor(
    @InjectRepository(InformacionPersonal)
    private readonly _informacionPersonalRepository:Repository<InformacionPersonal>,
    @InjectRepository(InformacionPersonalCoach)
    private readonly _informacionPersonalCoachRepository:Repository<InformacionPersonalCoach>,
    private readonly _ficherosService: FicherosService,
    private readonly _errorService: ErrorHandleService,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _catalogoService: CatalogoService,
    private readonly _vistaJugadorPerfilService: VistaJugadorPerfilService,
    private readonly _informacionPersonalService: InformacionPersonalService,
    private readonly _favoritosJugadoresCoachService: FavoritosJugadoresCoachService,
    private readonly _dataSource: DataSource,
    private readonly _auditLogService: AuditLogService,
    private readonly _historialEntrenadoresService: HistorialTrabajosCoachService,
    private readonly _mailService:MailService
  ) { }
//#endregion

//#region Metodos
  async findAll(usuarioId: number) {
    try {
      // En tu repositorio o servicio
      const infoPersonalConUsuario = await this._informacionPersonalRepository
      .createQueryBuilder('ip') // ip = Alias para InformacionPersonal
      
      // 1. Realizar el JOIN con la entidad Usuario
      .leftJoinAndSelect('ip.usuario', 'u') // u = Alias para Usuario

      // 2. JOIN a Municipio (a través de Usuario.municipioId)
      // Asume que la relación en la entidad Usuario se llama 'municipio'
      .leftJoin('u.municipio', 'm') // m = Municipio
      
      // 3. JOIN a Estado (a través de Municipio.estadoId)
      // Asume que la relación en la entidad Municipio se llama 'estado'
      .leftJoin('m.claveEstado2', 'e') // e = Estado
      
      // 2. Especificar qué campos quieres de la entidad principal (InformacionPersonal)
      .select([
          'ip.informacionPersonalId',
          'ip.fotoPerfilId',
          'ip.alias',
          'ip.altura',
          'ip.peso',
          'ip.estatusBusquedaJugadorId',
          'ip.manoJuego' ,
          'ip.posicionJuegoUnoId' ,
          'ip.posicionJuegoDosId' ,
          'ip.sexoId',
          // ... selecciona el resto de campos de ip
          
          // 3. Especificar qué campos quieres de la tabla join (Usuario)
          'u.nombre',        // Ejemplo de campo del usuario
          'u.aPaterno',     // Ejemplo de campo del usuario
          'u.aMaterno',         // Ejemplo de campo del usuario

            // 5. 💡 CAMPOS DE UBICACIÓN (nombres)
          'm.nombre as nombreMunicipio', // Nombre del Municipio
          'e.nombre as nombreEstado' // Nombre del Estado
      ])
      
      // 4. (Opcional) Puedes añadir condiciones WHERE aquí
      // .where('u.email = :email', { email: 'test@ejemplo.com' }) 
      
      // 5. Ejecutar la consulta
      .getRawMany();

      // console.log(infoPersonalConUsuario);

      let nuevaInfo: IListadoJugadores[] = [];

      for (let index = 0; index < infoPersonalConUsuario.length; index++) {
        // obtengo el estatus del perfil
        const estatusBusquedaJugador = await this._catalogoService.getInfoCatalogo(
          'estatus_busqueda_jugador_id',
          'estatus_busqueda_jugador',
          infoPersonalConUsuario[index].ip_estatus_busqueda_jugador_id
        );

        // obtengo el estatus del perfil
        const sexo = await this._catalogoService.getInfoCatalogo(
          'sexo_id',
          'sexo',
          infoPersonalConUsuario[index].ip_sexo_id
        );
  
        // obtengo las posiciones de basketabll
        const posicionJuegoUno = await this._catalogoService.getInfoCatalogo(
          'posicion_juego_id',
          'posicion_juego',
          infoPersonalConUsuario[index].ip_posicion_juego_uno_id
        );
  
        const posicionJuegoDos = await this._catalogoService.getInfoCatalogo(
          'posicion_juego_id',
          'posicion_juego',
          infoPersonalConUsuario[index].ip_posicion_juego_dos_id
        );

        // recupero la foto de perfil
        const fotoPerfilId = await this._ficherosService.getPublicIdByFicheroId(infoPersonalConUsuario[index].ip_foto_perfil_id);
        const fotoPerfilPublicId = await this._cloudinaryService.getImage(fotoPerfilId);

        let manoJuego: string = '';
        if (infoPersonalConUsuario[index].ip_mano_juego) {
          const manoJuegoBool = infoPersonalConUsuario[index].ip_mano_juego[0] !== 0;
          if (manoJuegoBool) {
            manoJuego = 'derecha'
          } else {
            manoJuego = 'izquierda'
          }
        }
        
        nuevaInfo.push({
          informacionPersonalId: infoPersonalConUsuario[index].ip_informacion_personal_id,
          fotoPerfil: infoPersonalConUsuario[index].ip_foto_perfil_id ? fotoPerfilPublicId : null,
          alias: infoPersonalConUsuario[index].ip_alias,
          nombre: infoPersonalConUsuario[index].u_nombre,
          aPaterno: infoPersonalConUsuario[index]. u_a_paterno,
          aMaterno: infoPersonalConUsuario[index]. u_a_materno,
          altura: infoPersonalConUsuario[index].ip_altura,
          peso: infoPersonalConUsuario[index].ip_peso,
          estatus: estatusBusquedaJugador?.nombre ?? undefined,
          manoJuego: manoJuego,
          posicionJuegoUno: posicionJuegoUno?.nombre ?? undefined ,
          posicionJuegoDos: posicionJuegoDos?.nombre ?? undefined ,
          sexo: sexo?.nombre ?? undefined ,
          municipio: infoPersonalConUsuario[index].nombreMunicipio,
          estado: infoPersonalConUsuario[index].nombreEstado,
          interesado: false
        });
      }

      for (let index = 0; index < nuevaInfo.length; index++) {
        const jugadorUsuarioId = await this._informacionPersonalService.getUsuarioIdByInformacionPersonalId(nuevaInfo[index].informacionPersonalId)
        const existe = await this._favoritosJugadoresCoachService.existeFavorito(usuarioId, jugadorUsuarioId);

        if (existe) {
          const jugadorFavoritoCoach = await this._favoritosJugadoresCoachService.getFavorito(usuarioId, jugadorUsuarioId);
          const interesBool = jugadorFavoritoCoach.interesado[0] !== 0;
          nuevaInfo[index].interesado = interesBool ? true : false;
        }
        
      }

      const response:IResponse<IListadoJugadores[] | undefined> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: nuevaInfo
      }
      // console.log(response);
      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async saveVistaPerfil(usuarioId: number, informacionPersonalId: number) {
    try {
      const jugadorId: number = await this._informacionPersonalService.getUsuarioIdByInformacionPersonalId(informacionPersonalId);
      const existe: boolean = await this._vistaJugadorPerfilService.existeVista(usuarioId, jugadorId);
      if (!existe) {
        await this._vistaJugadorPerfilService.insertaVista(usuarioId, jugadorId);
        const correo:string = await this.getCorreoJugadorByUsuarioId(jugadorId);
        await this._mailService.enviarCorreoAlguienVio(correo);

      }

    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

   async saveFavoritoPerfil(usuarioId: number, informacionPersonalId: number) {
    try {
      const jugadorId: number = await this._informacionPersonalService.getUsuarioIdByInformacionPersonalId(informacionPersonalId);
      const existe: boolean = await this._favoritosJugadoresCoachService.existeFavorito(usuarioId, jugadorId);

      let mensaje: string = '';
      
      if (existe) {
        console.log('llego al if para ACTUALIZAR la favorito');
        await this._favoritosJugadoresCoachService.updateFavorito(usuarioId, jugadorId);

        const jugadorFavoritoo = await this._favoritosJugadoresCoachService.getFavorito(usuarioId, jugadorId);
        const esInteresado = (jugadorFavoritoo.interesado[0] == 1);
        if (esInteresado) {
          const correo:string = await this.getCorreoJugadorByUsuarioId(jugadorId);
          await this._mailService.enviarCorreoAgregadoFaavorito(correo);
        }

        mensaje = 'Jugador eliminado de favoritos.';
      } else {
        await this._favoritosJugadoresCoachService.insertFavorito(usuarioId, jugadorId);
        const correo:string = await this.getCorreoJugadorByUsuarioId(jugadorId);
        await this._mailService.enviarCorreoAgregadoFaavorito(correo);

        mensaje = 'Jugador agregado a favoritos.';
      }

      const response:IResponse<any> = {
        statusCode: HttpStatus.OK,
        mensaje
      }

      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async findAllFavoritos(usuarioId: number) {
    try {
      // En tu repositorio o servicio
      const infoPersonalConUsuario = await this._informacionPersonalRepository
      .createQueryBuilder('ip') // ip = Alias para InformacionPersonal
      
      // 1. Realizar el JOIN con la entidad Usuario
      .leftJoinAndSelect('ip.usuario', 'u') // u = Alias para Usuario

      // 2. JOIN a Municipio (a través de Usuario.municipioId)
      // Asume que la relación en la entidad Usuario se llama 'municipio'
      .leftJoin('u.municipio', 'm') // m = Municipio
      
      // 3. JOIN a Estado (a través de Municipio.estadoId)
      // Asume que la relación en la entidad Municipio se llama 'estado'
      .leftJoin('m.claveEstado2', 'e') // e = Estado
      
      // 2. Especificar qué campos quieres de la entidad principal (InformacionPersonal)
      .select([
          'ip.informacionPersonalId',
          'ip.fotoPerfilId',
          'ip.alias',
          'ip.altura',
          'ip.peso',
          'ip.estatusBusquedaJugadorId',
          'ip.manoJuego' ,
          'ip.posicionJuegoUnoId' ,
          'ip.posicionJuegoDosId' ,
          'ip.sexoId',
          // ... selecciona el resto de campos de ip
          
          // 3. Especificar qué campos quieres de la tabla join (Usuario)
          'u.nombre',        // Ejemplo de campo del usuario
          'u.aPaterno',     // Ejemplo de campo del usuario
          'u.aMaterno',         // Ejemplo de campo del usuario

            // 5. 💡 CAMPOS DE UBICACIÓN (nombres)
          'm.nombre as nombreMunicipio', // Nombre del Municipio
          'e.nombre as nombreEstado', // Nombre del Estado
      ])
      
      // 4. (Opcional) Puedes añadir condiciones WHERE aquí
      // .where('u.email = :email', { email: 'test@ejemplo.com' }) 
      
      // 5. Ejecutar la consulta
      .getRawMany();

      // console.log(infoPersonalConUsuario);

      let nuevaInfo: IListadoJugadores[] = [];

      for (let index = 0; index < infoPersonalConUsuario.length; index++) {
        // obtengo el estatus del perfil
        const estatusBusquedaJugador = await this._catalogoService.getInfoCatalogo(
          'estatus_busqueda_jugador_id',
          'estatus_busqueda_jugador',
          infoPersonalConUsuario[index].ip_estatus_busqueda_jugador_id
        );
  
        // obtengo las posiciones de basketabll
        const posicionJuegoUno = await this._catalogoService.getInfoCatalogo(
          'posicion_juego_id',
          'posicion_juego',
          infoPersonalConUsuario[index].ip_posicion_juego_uno_id
        );

        // obtengo el estatus del perfil
        const sexo = await this._catalogoService.getInfoCatalogo(
          'sexo_id',
          'sexo',
          infoPersonalConUsuario[index].ip_sexo_id
        );
  
        const posicionJuegoDos = await this._catalogoService.getInfoCatalogo(
          'posicion_juego_id',
          'posicion_juego',
          infoPersonalConUsuario[index].ip_posicion_juego_dos_id
        );

        // recupero la foto de perfil
        const fotoPerfilId = await this._ficherosService.getPublicIdByFicheroId(infoPersonalConUsuario[index].ip_foto_perfil_id);
        const fotoPerfilPublicId = await this._cloudinaryService.getImage(fotoPerfilId);

        let manoJuego: string = '';
        if (infoPersonalConUsuario[index].ip_mano_juego) {
          const manoJuegoBool = infoPersonalConUsuario[index].ip_mano_juego[0] !== 0;
          if (manoJuegoBool) {
            manoJuego = 'derecha'
          } else {
            manoJuego = 'izquierda'
          }
        }
        
        nuevaInfo.push({
          informacionPersonalId: infoPersonalConUsuario[index].ip_informacion_personal_id,
          fotoPerfil: infoPersonalConUsuario[index].ip_foto_perfil_id ? fotoPerfilPublicId : null,
          alias: infoPersonalConUsuario[index].ip_alias,
          nombre: infoPersonalConUsuario[index].u_nombre,
          aPaterno: infoPersonalConUsuario[index]. u_a_paterno,
          aMaterno: infoPersonalConUsuario[index]. u_a_materno,
          altura: infoPersonalConUsuario[index].ip_altura,
          peso: infoPersonalConUsuario[index].ip_peso,
          estatus: estatusBusquedaJugador?.nombre ?? undefined,
          manoJuego: manoJuego,
          posicionJuegoUno: posicionJuegoUno?.nombre ?? undefined ,
          posicionJuegoDos: posicionJuegoDos?.nombre ?? undefined ,
          sexo: sexo?.nombre ?? undefined ,
          municipio: infoPersonalConUsuario[index].nombreMunicipio,
          estado: infoPersonalConUsuario[index].nombreEstado,
          interesado: false
        });
      }

      for (let index = 0; index < nuevaInfo.length; index++) {
        const jugadorUsuarioId = await this._informacionPersonalService.getUsuarioIdByInformacionPersonalId(nuevaInfo[index].informacionPersonalId)
        const existe = await this._favoritosJugadoresCoachService.existeFavorito(usuarioId, jugadorUsuarioId);

        if (existe) {
          const jugadorFavoritoCoach = await this._favoritosJugadoresCoachService.getFavorito(usuarioId, jugadorUsuarioId);
          const interesBool = jugadorFavoritoCoach.interesado[0] !== 0;
          nuevaInfo[index].interesado = interesBool ? true : false;
        }
        
      }

      const infoFavoritos = nuevaInfo.filter(x => x.interesado === true);

      const response:IResponse<IListadoJugadores[] | undefined> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: infoFavoritos
      }
      // console.log(response);
      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getTotalFavoritosPerfil(usuarioId: number) {
    try {

      const total: number = await this._favoritosJugadoresCoachService.getTotalFavoritosPerfilCoach(usuarioId);

      const response:IResponse<number> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: total
      }

      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async save(usuarioId:number, dto: UpsertInformacionPersonalDto, fotoPerfil?: Express.Multer.File) {
    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const infoRepo = queryRunner.manager.getRepository(InformacionPersonalCoach);

    try {
      let fotoPerfilResponse: UploadApiResponse;
      let ficheroFotoPerfil: Ficheros;

      const existing = await infoRepo.findOneBy({ coachId: usuarioId });

      const datosAntes = existing ? { ...existing } : null;

      // primero guardo foto perfil
      if (fotoPerfil) {
        // console.log('llego con foto', fotoPerfil)
        fotoPerfilResponse = await this._cloudinaryService.uploadFile(fotoPerfil, RoutesPathsClodudinary.IMAGEN_PERFIL);
        ficheroFotoPerfil = await this._ficherosService.uploadFichero(usuarioId, fotoPerfilResponse, existing.fotoPerfilId ?? 0, RoutesPathsClodudinary.IMAGEN_PERFIL, queryRunner.manager);
      }
      
      if (existing) {
        // primero hago patch del perfil
        for (const key in dto) {
          if (dto[key] !== undefined) {
            existing[key] = dto[key];
          }
        }

        if (ficheroFotoPerfil !== undefined) {
          existing.fotoPerfilId = ficheroFotoPerfil.ficheroId;
        }

        // actualizo experiencia
        const { historialTrabajoCoaches, ...restDto } = dto;

        // patch SOLO campos simples
        for (const key in restDto) {
          if (restDto[key] !== undefined) {
            existing[key] = restDto[key];
          }
        }

          // almaceno si existe historial de eventos
        if (historialTrabajoCoaches.length > 0) {
          await this._historialEntrenadoresService.delete(existing.informacionPersonalCoachId, queryRunner.manager);
          await this._historialEntrenadoresService.insert(existing.informacionPersonalCoachId, historialTrabajoCoaches, queryRunner.manager);
        }

        const toLogService = existing;

        existing.historialTrabajoCoaches = undefined;
        
        existing.fechaEdicion = new Date();
        existing.usuarioEdicion = usuarioId;

        // console.log('antres de cambios', existing);

        // const toUpdate: InformacionPersonalCoach = {
        //   informacionPersonalCoachId: existing.informacionPersonalCoachId,
        //   coachId: existing.coachId,
        //   fotoPerfilId: existing.fotoPerfilId ?? null,
        //   trabajoActual: existing.trabajoActual,
        //   personalidad: existing.personalidad,
        //   valores: existing.valores,
        //   objetivos: existing.objetivos,
        //   antiguedad: existing.antiguedad,
        //   fechaEdicion: existing.fechaEdicion,
        //   usuarioEdicion: existing.usuarioEdicion
        // };
        
        await infoRepo.save(existing);

        await this._auditLogService.update(queryRunner, {
          tableName: "informacion_personal_coach",
          id: existing.informacionPersonalCoachId,
          before: datosAntes,
          after: existing,
          user: toLogService,
          ip: undefined
        });

      } else {
        // nuevo
        // console.log('llegue al insert de informacion personal coach', ficheroFotoPerfil);
        const { historialTrabajoCoaches } = dto;
        const newInfoPersonal = infoRepo.create({
          coachId: usuarioId,
          fotoPerfilId: ficheroFotoPerfil?.ficheroId ?? null,
          trabajoActual: dto.trabajoActual,
          personalidad: dto.personalidad,
          valores: dto.valores,
          objetivos: dto.objetivos,
          antiguedad: +dto.antiguedad,
          usuarioCreacion: usuarioId
        });
      
        await infoRepo.create(newInfoPersonal);
        const savedInfo = await infoRepo.save(newInfoPersonal);

        // almaceno si existe historial de eventos
        if (historialTrabajoCoaches.length > 0) {
          await this._historialEntrenadoresService.insert(savedInfo.informacionPersonalCoachId, historialTrabajoCoaches, queryRunner.manager);
        }

        // Insert audit log
        await this._auditLogService.insert(queryRunner, {
          tableName: "informacion_personal_coach",
          id: savedInfo.informacionPersonalCoachId,
          after: savedInfo,
          user: usuarioId,
          ip: undefined
        });
      }

      await queryRunner.commitTransaction();

      const response:IResponse<any> = {
        statusCode: HttpStatus.CREATED,
        mensaje: 'Información actualizada.',
      }
  
      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    } finally {
      await queryRunner.release();
    }
  }

  async getInformacionPersonalIdByUsuarioId(usuarioId: number) {
    try {
      const informacionPersonalId = await this._informacionPersonalCoachRepository.findOne({
        where: {coachId: usuarioId},
        select: {
          informacionPersonalCoachId: true
        }
      });
      // console.log(informacionPersonalId);
      return informacionPersonalId.informacionPersonalCoachId;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getInformacionPersonal(usuarioId: number) {
    try {

      const informacionPersonalCoachId = await this.getInformacionPersonalIdByUsuarioId(usuarioId);

      // primero la tabla general de informacion personal
      const infoPersonal = await this._informacionPersonalCoachRepository.findOne({
        where: {informacionPersonalCoachId: informacionPersonalCoachId},
        select: {
          fotoPerfilId: true,
          coachId: true,
          trabajoActual: true,
          personalidad: true,
          valores: true,
          objetivos: true,
          antiguedad: true
        }
      });

      // si no existe es primera ves y lo saca
      if (!infoPersonal) {
        const response:IResponse<undefined> = {
          statusCode: HttpStatus.OK,
          mensaje: 'Usuario sin información personal.',
          data: undefined
        }
        
        return response;
      }
      
      
      // obtengo los historial de eventos, entrenadores y logros
      const historialEquipos = await this._historialEntrenadoresService.getAll(infoPersonal.informacionPersonalCoachId);

      // recupero la foto de perfil
      const fotoPerfilId = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.fotoPerfilId);
      const fotoPerfilPublicId = await this._cloudinaryService.getImage(fotoPerfilId);

      const sendInfoPersonal: IInformacionPersonalCoach = {
        ...infoPersonal,
        fotoPerfilPublicUrl: fotoPerfilPublicId,
        historialTrabajoCoaches: historialEquipos
      }

      const response:IResponse<IInformacionPersonalCoach> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: {
          ...sendInfoPersonal,
        }
      }
      // console.log(response);
      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  private async getCorreoJugadorByUsuarioId(usuarioId: number)
  {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const correo: string = await queryRunner.query(`
          select
            u.correo
          from usuario u
          where u.estatus_id = 1
          and u.usuario_id = ${usuarioId}
        `);
        console.log(correo, usuarioId);
      return correo[0]['correo'];
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
