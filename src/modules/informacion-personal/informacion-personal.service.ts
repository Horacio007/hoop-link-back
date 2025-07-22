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
import { info } from 'console';
import { IResponse } from '../../common/interfaces';
import { IInformacinPersonal } from '../../common/interfaces/informacion-personal/informacion-personal.interface';
import { CatalogoService } from '../catalogo/catalogo.service';

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

      // primero guardo foto perfil
      if (fotoPerfil) {
        console.log('entro sin una foto nueva');
        fotoPerfilResponse = await this._cloudinaryService.uploadFile(fotoPerfil);
        ficheroFotoPerfil = await this._ficherosService.uploadFotoPerfil(usuarioId, fotoPerfilResponse, dto.perfil.fotoPerfilId, queryRunner.manager);
      }
      
      const existing = await this._informacionPersonalRepository.findOneBy({ usuarioId });
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
          existing.estatusBusquedaJugador = undefined; 
          existing.estatusBusquedaJugadorId = +perfil.estatusBusquedaJugador.id;
        }
        existing.usuarioId = usuarioId;
        
        // actualiza la fuertza y resistencia
        const { fuerzaResistencia } = dto;

        for (const key in fuerzaResistencia) {
          if (fuerzaResistencia[key] !== undefined) {
            existing[key] = fuerzaResistencia[key];
          }
        }

        const { basketball } = dto; 
        
         for (const key in basketball) {
          if (basketball[key] !== undefined) {
            existing[key] = basketball[key];
          }
        }

        if (basketball.posicionJuegoUno?.id !== undefined) {
          existing.posicionJuegoUno = undefined; 
          existing.posicionJuegoUnoId = +basketball.posicionJuegoUno.id;
        }

        if (basketball.posicionJuegoDos?.id !== undefined) {
          existing.posicionJuegoDos = undefined; 
          existing.posicionJuegoDosId = +basketball.posicionJuegoDos.id;
        }
        
        existing.fechaEdicion = new Date();
        existing.usuarioEdicion = usuarioId;

        console.log('antres de cambios', existing);
        console.log(perfil.estatusBusquedaJugador);
        
        
        await infoRepo.save(existing);
      } else {
        // nuevo
        const { perfil, fuerzaResistencia, basketball } = dto;
        const newInfoPersonal = {
          usuarioId,
          fotoPerfilId: ficheroFotoPerfil.ficheroId ? ficheroFotoPerfil.ficheroId : null,
          altura: perfil.altura,
          peso: perfil.peso,
          estatusBusquedaJugadorId: +perfil.estatusBusquedaJugador.id,
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
          posicionJuegoUnoId: +basketball.posicionJuegoUno.id ,
          posicionJuegoDosId: +basketball.posicionJuegoDos.id ,
          clavas: basketball.clavas ,
          puntosPorJuego: basketball.puntosPorJuego ,
          asistenciasPorJuego: basketball.asistenciasPorJuego ,
          rebotesPorJuego: basketball.rebotesPorJuego ,
          porcentajeTirosMedia: basketball.porcentajeTirosMedia ,
          porcentajeTirosTres: basketball.porcentajeTirosTres ,
          porcentajeTirosLibres: basketball.porcentajeTirosLibres ,
          usuarioCreacion: usuarioId
        }
      
        await infoRepo.create(newInfoPersonal);
        await infoRepo.save(newInfoPersonal);
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
      const infoPersonal = await this._informacionPersonalRepository.findOne({
        where: {usuarioId},
        select: {
          informacionPersonalId: true,
          fotoPerfilId: true,
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
        }
      });

      // si no existe es primera ves y lo saca
      if (!infoPersonal) this._errorService.setError('algomal');
      
      const estatusBusquedaJugador = await this._catalogoService.getInfoCatalogo(
        'estatus_busqueda_jugador_id',
        'estatus_busqueda_jugador',
        infoPersonal.estatusBusquedaJugadorId
      );

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
        
      const fotoPerfilId = await this._ficherosService.getPublicIdByFicheroId(infoPersonal.fotoPerfilId);
      const fotoPerfilPublicId = await this._cloudinaryService.getImage(fotoPerfilId);

      const sendInfoPersonal: IInformacinPersonal = {
        ...infoPersonal,
        fotoPerfilPublicUrl: fotoPerfilPublicId,
        estatusBusquedaJugador,
        posicionJuegoUno,
        posicionJuegoDos,
      }

      // Si manoJuego viene como Buffer o Uint8Array
      const manoJuegoBuffer = sendInfoPersonal.manoJuego;
      const clavasBuffer = sendInfoPersonal.clavas;
      
      // Convertimos a boolean
      const manoJuegoBool = manoJuegoBuffer[0] !== 0;
      const clavasBool = clavasBuffer[0] !== 0;

      const response:IResponse<IInformacinPersonal> = {
        statusCode: HttpStatus.OK,
        mensaje: 'Información obtenida.',
        data: {
          ...sendInfoPersonal,
          manoJuego: manoJuegoBool,
          clavas: clavasBool
        }
      }

      return response;
    } catch (error) {
      this._errorService.errorHandle(error, ErrorMethods.BadRequestException);
    }
  }
//#endregion

}
