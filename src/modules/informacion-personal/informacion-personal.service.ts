import { HttpStatus, Injectable } from '@nestjs/common';
import { UpsertInformacionPersonalDto } from './dto/upsert-informacion-personal.dto';
import { InformacionPersonal } from '../../entities/InformacionPersonal';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ErrorHandleService } from '../../common/error/services/common.error-handle.service';
import { ErrorMethods } from '../../common/error/enum/common.error-handle.enum';
import { CloudinaryService } from '../../common/cloudinary/services/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { Ficheros } from '../../entities/Ficheros';
import { FicherosService } from '../ficheros/ficheros.service';
import { info, error } from 'console';
import { IResponse } from '../../common/interfaces';
import { IInformacionPersonal } from '../../common/interfaces/informacion-personal/informacion-personal.interface';
import { CatalogoService } from '../catalogo/catalogo.service';
import { HistorialEquiposInformacionPersonalService } from '../historial-eventos-informacion-personal/historial-equipos-informacion-personal.service';
import { HistorialEntrenadoresInformacionPersonalService } from '../historial-entrenadores-informacion-personal/historial-entrenadores-informacion-personal.service';
import { LogrosClaveInformacionPersonalService } from '../logros-clave-informacion-personal/logros-clave-informacion-personal.service';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar: npm install uuid
import { RoutesPathsClodudinary } from '../../common/cloudinary/constants/route-paths.const';
import { IVideoInformacionPersonalResponse } from '../../common/interfaces/informacion-personal/videos/videos-response.interface';
import { AuditLogService } from '../audit-log/audit-log.service';
import { VistaJugadorPerfilService } from '../vista-jugador-perfil/vista-jugador-perfil.service';

@Injectable()
export class InformacionPersonalService {
//#region Constructor
  constructor(
    @InjectRepository(InformacionPersonal)
    private readonly _informacionPersonalRepository:Repository<InformacionPersonal>,
    private readonly _ficherosService: FicherosService,
    private readonly _errorService: ErrorHandleService,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _dataSource: DataSource,
    private readonly _catalogoService: CatalogoService,
    private readonly _historialEquipossService: HistorialEquiposInformacionPersonalService,
    private readonly _historialEntrenadoresService: HistorialEntrenadoresInformacionPersonalService,
    private readonly _logrosClaveService: LogrosClaveInformacionPersonalService,
    private readonly _auditLogService: AuditLogService,
    private readonly _vistaJugadorPerfilService: VistaJugadorPerfilService,
  ) { }
//#endregion

//#region Servicios
  async save(usuarioId:number, dto: UpsertInformacionPersonalDto, fotoPerfil?: Express.Multer.File) {
    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const infoRepo = queryRunner.manager.getRepository(InformacionPersonal);

    try {
      let fotoPerfilResponse: UploadApiResponse;
      let ficheroFotoPerfil: Ficheros;

      const existing = await infoRepo.findOneBy({ usuarioId });

      const datosAntes = existing ? { ...existing } : null;

      // primero guardo foto perfil
      if (fotoPerfil) {
        fotoPerfilResponse = await this._cloudinaryService.uploadFile(fotoPerfil, RoutesPathsClodudinary.IMAGEN_PERFIL);
        ficheroFotoPerfil = await this._ficherosService.uploadFichero(usuarioId, fotoPerfilResponse, existing.fotoPerfilId ?? 0, RoutesPathsClodudinary.IMAGEN_PERFIL, queryRunner.manager);
      }
      
      if (existing) {
        const { perfil } = dto;
        console.log('ENTRE', existing);
        // primero hago patch del perfil
        for (const key in perfil) {
          if (perfil[key] !== undefined) {
            existing[key] = perfil[key];
          }
        }

        if (ficheroFotoPerfil !== undefined) {
          existing.fotoPerfilId = ficheroFotoPerfil.ficheroId;
        }
        if (perfil.estatusBusquedaJugador?.id !== undefined) {
          const estatusId = perfil.estatusBusquedaJugador.id;
    
          // Si el ID es una cadena vacía (''), asigna null. De lo contrario, convierte a número.
          if (estatusId === '' || estatusId === null) {
              existing.estatusBusquedaJugadorId = null;
          } else {
              existing.estatusBusquedaJugadorId = +estatusId;
          }
          existing.estatusBusquedaJugador = undefined;
        }
        existing.usuarioId = usuarioId;
        
        // actualiza la fuertza y resistencia
        const { fuerzaResistencia } = dto;

        for (const key in fuerzaResistencia) {
          if (fuerzaResistencia[key] !== undefined) {
            existing[key] = fuerzaResistencia[key];
          }
        }

        // actualizo baskteball
        const { basketball } = dto; 
        
        for (const key in basketball) {
          if (basketball[key] !== undefined) {
            existing[key] = basketball[key];
          }
        }

        if (basketball.posicionJuegoUno?.id !== undefined) {
          const posicionUnoId = basketball.posicionJuegoUno.id;
    
          // Si el ID es una cadena vacía (''), asigna null. De lo contrario, convierte a número.
          if (posicionUnoId === '' || posicionUnoId === null) {
              existing.posicionJuegoUnoId = null;
          } else {
              existing.posicionJuegoUnoId = +posicionUnoId;
          }
          existing.posicionJuegoUno = undefined;
        }

        if (basketball.posicionJuegoDos?.id !== undefined) {
          const posicionDosId = basketball.posicionJuegoDos.id;
    
          // Si el ID es una cadena vacía (''), asigna null. De lo contrario, convierte a número.
          if (posicionDosId === '' || posicionDosId === null) {
              existing.posicionJuegoDosId = null;
          } else {
              existing.posicionJuegoDosId = +posicionDosId;
          }
          existing.posicionJuegoDos = undefined;
        }

        // actualizo experiencia
        const { experiencia } = dto;

        for (const key in experiencia) {
          if (experiencia[key] !== undefined) {
            existing[key] = experiencia[key];
          }
        }

         // almaceno si existe historial de eventos
        if (experiencia.historialEquipos) {
          await this._historialEquipossService.delete(existing.informacionPersonalId, queryRunner.manager);
          await this._historialEquipossService.insert(existing.informacionPersonalId, experiencia.historialEquipos, queryRunner.manager);
        }

        // almaceno si existe historial de entrenadores
        if (experiencia.historialEntrenadores) {
          await this._historialEntrenadoresService.delete(existing.informacionPersonalId, queryRunner.manager);
          await this._historialEntrenadoresService.insert(existing.informacionPersonalId, experiencia.historialEntrenadores, queryRunner.manager);
        }

         // almaceno si existe logros clave
        if (experiencia.logrosClave) {
          await this._logrosClaveService.delete(existing.informacionPersonalId, queryRunner.manager);
          await this._logrosClaveService.insert(existing.informacionPersonalId, experiencia.logrosClave, queryRunner.manager);
        }

        //actualizo vision
        const { vision } = dto;

        for (const key in vision) {
          if (vision[key] !== undefined) {
            existing[key] = vision[key];
          }
        }

        //actualizo redes
        const { redes } = dto;

        for (const key in redes) {
          if (redes[key] !== undefined) {
            existing[key] = redes[key];
          }
        }
        
        existing.fechaEdicion = new Date();
        existing.usuarioEdicion = usuarioId;

        console.log('antres de cambios', existing);
        console.log(perfil.estatusBusquedaJugador);
        
        
        await infoRepo.save(existing);

        await this._auditLogService.update(queryRunner, {
          tableName: "informacion_personal",
          id: existing.informacionPersonalId,
          before: datosAntes,
          after: existing,
          user: usuarioId,
          ip: undefined
        });

      } else {
        // nuevo
        console.log('llegue al insert de informacion personal', ficheroFotoPerfil);
        const { perfil, fuerzaResistencia, basketball, experiencia, vision, redes } = dto;
        const newInfoPersonal = infoRepo.create({
          usuarioId,
          fotoPerfilId: ficheroFotoPerfil?.ficheroId ?? null,
          alias: perfil.alias,
          altura: perfil.altura,
          peso: perfil.peso,
          estatusBusquedaJugadorId: perfil.estatusBusquedaJugador?.id ? +perfil.estatusBusquedaJugador.id : null,
          medidaMano: perfil.medidaMano,
          largoBrazo: perfil.largoBrazo,
          quienEres: perfil.quienEres,
          alturaSaltoVertical: fuerzaResistencia.alturaSaltoVertical ,
          distanciaSaltoHorizontal: fuerzaResistencia.distanciaSaltoHorizontal ,
          pesoBenchPress: fuerzaResistencia.pesoBenchPress ,
          pesoSquats: fuerzaResistencia.pesoSquats ,
          pesoPressMilitar: fuerzaResistencia.pesoPressMilitar ,
          pesoRepeticionBenchPress: fuerzaResistencia.pesoRepeticionBenchPress ,
          pesoRepeticionSquats: fuerzaResistencia.pesoRepeticionSquats ,
          pesoRepeticionPressMilitar: fuerzaResistencia.pesoRepeticionPressMilitar ,
          tiempoDistanciaCienMts: fuerzaResistencia.tiempoDistanciaCienMts ,
          tiempoDistanciaUnKm: fuerzaResistencia.tiempoDistanciaUnKm ,
          tiempoDistanciaTresKm: fuerzaResistencia.tiempoDistanciaTresKm ,
          anioEmpezoAJugar: basketball.anioEmpezoAJugar ,
          manoJuego: basketball.manoJuego ,
          posicionJuegoUnoId: basketball.posicionJuegoUno?.id ? +basketball.posicionJuegoUno.id : null ,
          posicionJuegoDosId: basketball.posicionJuegoDos?.id ? +basketball.posicionJuegoDos.id : null ,
          clavas: basketball.clavas ,
          puntosPorJuego: basketball.puntosPorJuego ,
          asistenciasPorJuego: basketball.asistenciasPorJuego ,
          rebotesPorJuego: basketball.rebotesPorJuego ,
          porcentajeTirosMedia: basketball.porcentajeTirosMedia ,
          porcentajeTirosTres: basketball.porcentajeTirosTres ,
          porcentajeTirosLibres: basketball.porcentajeTirosLibres ,
          desdeCuandoJuegas: experiencia.desdeCuandoJuegas,
          horasEntrenamientoSemana: experiencia.horasEntrenamientoSemana,
          horasGymSemana: experiencia.horasGymSemana,
          pertenecesClub: experiencia.pertenecesClub,
          nombreClub: experiencia.nombreClub,
          objetivos: vision.objetivos,
          valores: vision.valores,
          facebook: redes.facebook ,
          instagram: redes.instagram ,
          tiktok: redes.tiktok ,
          youtube: redes.youtube ,
          usuarioCreacion: usuarioId
        });
      
        await infoRepo.create(newInfoPersonal);
        const savedInfo = await infoRepo.save(newInfoPersonal);

        // almaceno si existe historial de eventos
        if (experiencia.historialEquipos) {
          await this._historialEquipossService.insert(savedInfo.informacionPersonalId, experiencia.historialEquipos, queryRunner.manager);
        }

        // almaceno si existe historial de entrenadores
        if (experiencia.historialEntrenadores) {
          await this._historialEntrenadoresService.insert(savedInfo.informacionPersonalId, experiencia.historialEntrenadores, queryRunner.manager);
        }

         // almaceno si existe logros clave
        if (experiencia.logrosClave) {
          await this._logrosClaveService.insert(savedInfo.informacionPersonalId, experiencia.logrosClave, queryRunner.manager);
        }

        // Insert audit log
        await this._auditLogService.insert(queryRunner, {
          tableName: "informacion_personal",
          id: savedInfo.informacionPersonalId,
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

  async getInformacionPersonal(usuarioId: number) {
    try {
      // primero la tabla general de informacion personal
      const infoPersonal = await this._informacionPersonalRepository.findOne({
        where: {usuarioId},
        select: {
          informacionPersonalId: true,
          fotoPerfilId: true,
          alias: true,
          altura: true,
          peso: true,
          estatusBusquedaJugadorId: true,
          medidaMano: true,
          largoBrazo: true,
          quienEres: true,
          alturaSaltoVertical: true ,
          distanciaSaltoHorizontal: true ,
          pesoBenchPress: true ,
          pesoSquats: true ,
          pesoPressMilitar: true ,
          pesoRepeticionBenchPress: true ,
          pesoRepeticionSquats: true ,
          pesoRepeticionPressMilitar: true ,
          tiempoDistanciaCienMts: true ,
          tiempoDistanciaUnKm: true ,
          tiempoDistanciaTresKm: true ,
          tiempoDistanciaCincoKm: true ,
          anioEmpezoAJugar: true ,
          manoJuego: true ,
          posicionJuegoUnoId: true ,
          posicionJuegoDosId: true ,
          clavas: true ,
          puntosPorJuego: true ,
          asistenciasPorJuego: true ,
          rebotesPorJuego: true ,
          porcentajeTirosMedia: true ,
          porcentajeTirosTres: true ,
          porcentajeTirosLibres: true ,
          desdeCuandoJuegas: true ,
          horasEntrenamientoSemana: true ,
          horasGymSemana: true ,
          pertenecesClub: true ,
          nombreClub: true ,
          objetivos: true ,
          valores: true ,
          videoBotandoId: true ,
          videoTirandoId: true ,
          videoColadaId: true ,
          videoEntrenandoId: true ,
          videoJugandoId: true , 
          facebook: true ,
          instagram: true ,
          tiktok: true ,
          youtube: true ,
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
      
      // obtengo el estatus del perfil
      const estatusBusquedaJugador = await this._catalogoService.getInfoCatalogo(
        'estatus_busqueda_jugador_id',
        'estatus_busqueda_jugador',
        infoPersonal.estatusBusquedaJugadorId
      );

      // obtengo las posiciones de basketabll
      const posicionJuegoUno = await this._catalogoService.getInfoCatalogo(
        'posicion_juego_id',
        'posicion_juego',
        infoPersonal.posicionJuegoUnoId
      );

      const posicionJuegoDos = await this._catalogoService.getInfoCatalogo(
        'posicion_juego_id',
        'posicion_juego',
        infoPersonal.posicionJuegoDosId
      );
      
      // obtengo los historial de eventos, entrenadores y logros
      const historialEquipos = await this._historialEquipossService.getAll(infoPersonal.informacionPersonalId);
      const historialEntrenadores = await this._historialEntrenadoresService.getAll(infoPersonal.informacionPersonalId);
      const logrosClave = await this._logrosClaveService.getAll(infoPersonal.informacionPersonalId);

      // recupero la foto de perfil
      const fotoPerfilId = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.fotoPerfilId);
      const fotoPerfilPublicId = await this._cloudinaryService.getImage(fotoPerfilId);

      // recupero los diferentes videos
      let videoBotandoPublicId;
      if (infoPersonal.videoBotandoId) {
        const videoBotando = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoBotandoId ?? 0);
        videoBotandoPublicId = await this._cloudinaryService.getVideo(videoBotando);
      }

      let videoTirandoPublicId;
      if (infoPersonal.videoTirandoId) {
        const videoTirando = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoTirandoId);
        videoTirandoPublicId = await this._cloudinaryService.getVideo(videoTirando); 
      }

      let videoColadaPublicId;
      if (infoPersonal.videoColadaId) {
        const videoColada = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoColadaId);
        videoColadaPublicId = await this._cloudinaryService.getVideo(videoColada);

      }

      let videoEntrenandoPublicId;
      if (infoPersonal.videoEntrenandoId) {
        const videoEntrenando = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoEntrenandoId);
        videoEntrenandoPublicId = await this._cloudinaryService.getVideo(videoEntrenando);
      }

      let videoJugandoPublicId;
      if (infoPersonal.videoJugandoId) {
        const videoJugando = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoJugandoId);
        videoJugandoPublicId = await this._cloudinaryService.getVideo(videoJugando);
      } 

      const sendInfoPersonal: IInformacionPersonal = {
        ...infoPersonal,
        fotoPerfilPublicUrl: fotoPerfilPublicId,
        estatusBusquedaJugador,
        posicionJuegoUno,
        posicionJuegoDos,
      }

      if (videoBotandoPublicId) {
        sendInfoPersonal.videoBotandoPublicUrl = videoBotandoPublicId['url'];
      }

      if (videoTirandoPublicId) {
        sendInfoPersonal.videoTirandoPublicUrl = videoTirandoPublicId['url'];
      }

      if (videoColadaPublicId) {
        sendInfoPersonal.videoColadaPublicUrl = videoColadaPublicId['url'];
      }

      if (videoEntrenandoPublicId) {
        sendInfoPersonal.videoEntrenandoPublicUrl = videoEntrenandoPublicId['url'];
      }

      if (videoJugandoPublicId) {
        sendInfoPersonal.videoJugandoPublicUrl = videoJugandoPublicId['url'];
      }

      // Si manoJuego viene como Buffer o Uint8Array
      const manoJuegoBuffer = sendInfoPersonal.manoJuego;
      const clavasBuffer = sendInfoPersonal.clavas;
      const perteneceClubBuffer = sendInfoPersonal.pertenecesClub
      
      // Convertimos a boolean
      const manoJuegoBool = manoJuegoBuffer[0] !== 0;
      const clavasBool = clavasBuffer[0] !== 0;
      const perteneClubBool = perteneceClubBuffer[0] !== 0;

      const response:IResponse<IInformacionPersonal> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: {
          ...sendInfoPersonal,
          manoJuego: manoJuegoBool,
          clavas: clavasBool,
          pertenecesClub:perteneClubBool,
          historialEquipos: historialEquipos,
          historialEntrenadores,
          logrosClave,
        }
      }
      // console.log(response);
      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getInformacionPersonalById(informacionPersonalId: number) {
    try {
      // primero la tabla general de informacion personal
      const infoPersonal = await this._informacionPersonalRepository.findOne({
        where: {informacionPersonalId},
        select: {
          informacionPersonalId: true,
          fotoPerfilId: true,
          alias: true,
          altura: true,
          peso: true,
          estatusBusquedaJugadorId: true,
          medidaMano: true,
          largoBrazo: true,
          quienEres: true,
          alturaSaltoVertical: true ,
          distanciaSaltoHorizontal: true ,
          pesoBenchPress: true ,
          pesoSquats: true ,
          pesoPressMilitar: true ,
          pesoRepeticionBenchPress: true ,
          pesoRepeticionSquats: true ,
          pesoRepeticionPressMilitar: true ,
          tiempoDistanciaCienMts: true ,
          tiempoDistanciaUnKm: true ,
          tiempoDistanciaTresKm: true ,
          tiempoDistanciaCincoKm: true ,
          anioEmpezoAJugar: true ,
          manoJuego: true ,
          posicionJuegoUnoId: true ,
          posicionJuegoDosId: true ,
          clavas: true ,
          puntosPorJuego: true ,
          asistenciasPorJuego: true ,
          rebotesPorJuego: true ,
          porcentajeTirosMedia: true ,
          porcentajeTirosTres: true ,
          porcentajeTirosLibres: true ,
          desdeCuandoJuegas: true ,
          horasEntrenamientoSemana: true ,
          horasGymSemana: true ,
          pertenecesClub: true ,
          nombreClub: true ,
          objetivos: true ,
          valores: true ,
          videoBotandoId: true ,
          videoTirandoId: true ,
          videoColadaId: true ,
          videoEntrenandoId: true ,
          videoJugandoId: true , 
          facebook: true ,
          instagram: true ,
          tiktok: true ,
          youtube: true ,
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
      
      // obtengo el estatus del perfil
      const estatusBusquedaJugador = await this._catalogoService.getInfoCatalogo(
        'estatus_busqueda_jugador_id',
        'estatus_busqueda_jugador',
        infoPersonal.estatusBusquedaJugadorId
      );

      // obtengo las posiciones de basketabll
      const posicionJuegoUno = await this._catalogoService.getInfoCatalogo(
        'posicion_juego_id',
        'posicion_juego',
        infoPersonal.posicionJuegoUnoId
      );

      const posicionJuegoDos = await this._catalogoService.getInfoCatalogo(
        'posicion_juego_id',
        'posicion_juego',
        infoPersonal.posicionJuegoDosId
      );
      
      // obtengo los historial de eventos, entrenadores y logros
      const historialEquipos = await this._historialEquipossService.getAll(infoPersonal.informacionPersonalId);
      const historialEntrenadores = await this._historialEntrenadoresService.getAll(infoPersonal.informacionPersonalId);
      const logrosClave = await this._logrosClaveService.getAll(infoPersonal.informacionPersonalId);

      // recupero la foto de perfil
      const fotoPerfilId = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.fotoPerfilId);
      const fotoPerfilPublicId = await this._cloudinaryService.getImage(fotoPerfilId);

      // recupero los diferentes videos
      let videoBotandoPublicId;
      if (infoPersonal.videoBotandoId) {
        const videoBotando = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoBotandoId ?? 0);
        videoBotandoPublicId = await this._cloudinaryService.getVideo(videoBotando);
      }

      let videoTirandoPublicId;
      if (infoPersonal.videoTirandoId) {
        const videoTirando = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoTirandoId);
        videoTirandoPublicId = await this._cloudinaryService.getVideo(videoTirando); 
      }

      let videoColadaPublicId;
      if (infoPersonal.videoColadaId) {
        const videoColada = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoColadaId);
        videoColadaPublicId = await this._cloudinaryService.getVideo(videoColada);

      }

      let videoEntrenandoPublicId;
      if (infoPersonal.videoEntrenandoId) {
        const videoEntrenando = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoEntrenandoId);
        videoEntrenandoPublicId = await this._cloudinaryService.getVideo(videoEntrenando);
      }

      let videoJugandoPublicId;
      if (infoPersonal.videoJugandoId) {
        const videoJugando = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.videoJugandoId);
        videoJugandoPublicId = await this._cloudinaryService.getVideo(videoJugando);
      } 

      const sendInfoPersonal: IInformacionPersonal = {
        ...infoPersonal,
        fotoPerfilPublicUrl: fotoPerfilPublicId,
        estatusBusquedaJugador,
        posicionJuegoUno,
        posicionJuegoDos,
      }

      if (videoBotandoPublicId) {
        sendInfoPersonal.videoBotandoPublicUrl = videoBotandoPublicId['url'];
      }

      if (videoTirandoPublicId) {
        sendInfoPersonal.videoTirandoPublicUrl = videoTirandoPublicId['url'];
      }

      if (videoColadaPublicId) {
        sendInfoPersonal.videoColadaPublicUrl = videoColadaPublicId['url'];
      }

      if (videoEntrenandoPublicId) {
        sendInfoPersonal.videoEntrenandoPublicUrl = videoEntrenandoPublicId['url'];
      }

      if (videoJugandoPublicId) {
        sendInfoPersonal.videoJugandoPublicUrl = videoJugandoPublicId['url'];
      }

      // Si manoJuego viene como Buffer o Uint8Array
      const manoJuegoBuffer = sendInfoPersonal.manoJuego;
      const clavasBuffer = sendInfoPersonal.clavas;
      const perteneceClubBuffer = sendInfoPersonal.pertenecesClub
      
      // Convertimos a boolean
      const manoJuegoBool = manoJuegoBuffer[0] !== 0;
      const clavasBool = clavasBuffer[0] !== 0;
      const perteneClubBool = perteneceClubBuffer[0] !== 0;

      const response:IResponse<IInformacionPersonal> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: {
          ...sendInfoPersonal,
          manoJuego: manoJuegoBool,
          clavas: clavasBool,
          pertenecesClub:perteneClubBool,
          historialEquipos: historialEquipos,
          historialEntrenadores,
          logrosClave,
        }
      }
      // console.log(response);
      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async uploadVideo(usuarioId:number, file: Express.Multer.File, ficheroId:number, tipo:string): Promise<IResponse<IVideoInformacionPersonalResponse>> {
    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const infoRepo = queryRunner.manager.getRepository(InformacionPersonal);

    try {
      if (file) {
        const videoResponse = await this._cloudinaryService.uploadFile(file, RoutesPathsClodudinary.VIDEOS_INFORMACION_PERSONAL, "video");
        let ficheroVideoResponse;
        switch (tipo) {
          case "Botando":
            const ficheroBotandoId = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                videoBotandoId: true
              }
            });

            ficheroVideoResponse = await this._ficherosService.uploadFichero(usuarioId, videoResponse, ficheroBotandoId !== null ? ficheroBotandoId?.videoBotandoId : 0, RoutesPathsClodudinary.VIDEOS_INFORMACION_PERSONAL, queryRunner.manager, "video");
            console.log('entro al botando');
            const infoPersonalBotando = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                informacionPersonalId: true,
                videoBotandoId: true ,
              }
            });

            if (infoPersonalBotando) {
              console.log('entro al update');
              infoPersonalBotando.videoBotandoId = ficheroVideoResponse.ficheroId;
              const result = await infoRepo.save(infoPersonalBotando);
              console.log('Resultado del save:', result);
            }

            break;

          case "Tirando":
            const ficheroTirandoId = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                videoTirandoId: true
              }
            });

            ficheroVideoResponse = await this._ficherosService.uploadFichero(usuarioId, videoResponse, ficheroTirandoId !== null ? ficheroTirandoId?.videoTirandoId : 0, RoutesPathsClodudinary.VIDEOS_INFORMACION_PERSONAL, queryRunner.manager, "video");
            
            const infoPersonalTirando = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                informacionPersonalId: true,
                videoTirandoId: true ,
              }
            });

            if (infoPersonalTirando) {
              infoPersonalTirando.videoTirandoId = ficheroVideoResponse.ficheroId;
              await infoRepo.save(infoPersonalTirando);
            }  
            break;
          
          case "Colada":
            let ficheroColadaId = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                videoColadaId: true
              }
            });
                        
            ficheroVideoResponse = await this._ficherosService.uploadFichero(usuarioId, videoResponse, ficheroColadaId !== null ? ficheroColadaId?.videoColadaId : 0, RoutesPathsClodudinary.VIDEOS_INFORMACION_PERSONAL, queryRunner.manager, "video");
           
            const infoPersonalColada = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                informacionPersonalId: true,
                videoColadaId: true ,
              }
            });

            if (infoPersonalColada) {
              infoPersonalColada.videoColadaId = ficheroVideoResponse.ficheroId;
              await infoRepo.save(infoPersonalColada);
            }  
            break;

          case "Entrenando":
              const ficheroEntrenandoId = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                videoEntrenandoId: true
              }
            });

            ficheroVideoResponse = await this._ficherosService.uploadFichero(usuarioId, videoResponse, ficheroEntrenandoId !== null ? ficheroEntrenandoId?.videoEntrenandoId : 0, RoutesPathsClodudinary.VIDEOS_INFORMACION_PERSONAL, queryRunner.manager, "video");

            const infoPersonalEntrenando = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                informacionPersonalId: true,
                videoEntrenandoId: true ,
              }
            });

            if (infoPersonalEntrenando) {
              infoPersonalEntrenando.videoEntrenandoId = ficheroVideoResponse.ficheroId;
              await infoRepo.save(infoPersonalEntrenando);
            }  
            break;
        
          case "Jugando":
             const ficheroJugandoId = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                videoJugandoId: true
              }
            });
                        
            ficheroVideoResponse = await this._ficherosService.uploadFichero(usuarioId, videoResponse, ficheroJugandoId !== null ? ficheroJugandoId?.videoJugandoId : 0, RoutesPathsClodudinary.VIDEOS_INFORMACION_PERSONAL, queryRunner.manager, "video");
            console.log(ficheroVideoResponse);
            const infoPersonalJugando = await infoRepo.findOne({
              where: {usuarioId},
              select: {
                informacionPersonalId: true,
                videoJugandoId: true ,
              }
            });

            if (infoPersonalJugando) {
              infoPersonalJugando.videoJugandoId = ficheroVideoResponse.ficheroId;
              await infoRepo.save(infoPersonalJugando);
            }  
            break;

          default:
            break;
        }

        await queryRunner.commitTransaction();

        const response:IResponse<IVideoInformacionPersonalResponse> = {
          statusCode: HttpStatus.OK,
          mensaje: 'Fichero actualizado.',
          data: {
             ficheroId: ficheroVideoResponse.ficheroId,
            pathPublic: videoResponse.secure_url
          }
        }

        return response;
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    } finally {
      await queryRunner.release();
    }
  }

  async getUsuarioIdByInformacionPersonalId(informacionPersonalId: number) {
    try {
      const usuarioId = await this._informacionPersonalRepository.findOne({
        where: {informacionPersonalId},
        select: {
          usuarioId: true
        }
      });

      return usuarioId.usuarioId;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getInformacionPersonalIdByUsuarioId(usuarioId: number) {
    try {
      const informacionPersonalId = await this._informacionPersonalRepository.findOne({
        where: {usuarioId},
        select: {
          informacionPersonalId: true
        }
      });

      return informacionPersonalId.informacionPersonalId;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }

  async getTotalVistasPerfil(usuarioId: number) {
    try {

      const total: number = await this._vistaJugadorPerfilService.getTotalVistasPerfil(usuarioId);

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
//#endregion

}
