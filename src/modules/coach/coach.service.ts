import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class CoachService {
//#region Constructor
  constructor(
    @InjectRepository(InformacionPersonal)
    private readonly _informacionPersonalRepository:Repository<InformacionPersonal>,
    private readonly _ficherosService: FicherosService,
    private readonly _errorService: ErrorHandleService,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _catalogoService: CatalogoService,
    private readonly _vistaJugadorPerfilService: VistaJugadorPerfilService,
    private readonly _informacionPersonalService: InformacionPersonalService,
    private readonly _favoritosJugadoresCoachService: FavoritosJugadoresCoachService,
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

      console.log(infoPersonalConUsuario);

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
        mensaje = 'Jugador eliminado de favoritos.';
      } else {
        await this._favoritosJugadoresCoachService.insertFavorito(usuarioId, jugadorId);
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

      console.log(infoPersonalConUsuario);

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

//#endregion


}
