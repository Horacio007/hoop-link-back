import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ErrorHandleService } from '../common/error/common.error-handle.service';
import { ErrorMethods } from '../common/enums/errors/common.error-handle.enum';
import { ICatalogo } from './interfaces/catalogo.interface';

@Injectable()
export class CatalogoService {

  constructor(
    private readonly dataSource:DataSource,
    private readonly errorHandleService: ErrorHandleService
  ) { }

  async getAllTipoUsuario(): Promise<ICatalogo[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const tipoUsuario: ICatalogo[] = await queryRunner.query(`
          select
            tipo_usuario_id as id,
            nombre
          from tipo_usuario
          where estatus_id = 1
          and rol_id <> 1
          order by orden
        `);

      return tipoUsuario;
    } catch (error) {
      await queryRunner.release();
      this.errorHandleService.errorHandle(error, ErrorMethods.BadRequestException);
    }
    finally {
      await queryRunner.release();
    }
  }

  async getAllEstado(): Promise<ICatalogo[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const estados: ICatalogo[] = await queryRunner.query(`
          select
            clave_estado as id,
            nombre
          from estado
        `);

      return estados;
    } catch (error) {
      await queryRunner.release();
      this.errorHandleService.errorHandle(error, ErrorMethods.BadRequestException);
    }
    finally {
      await queryRunner.release();
    }
  }

  async getAllMunicipioByEstado(id:string): Promise<ICatalogo[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const municipios: ICatalogo[] = await queryRunner.query(`
          select
            municipio_id as id,
            nombre
          from municipio
          where clave_estado = ?
        `, [id]);

      return municipios;
    } catch (error) {
      await queryRunner.release();
      this.errorHandleService.errorHandle(error, ErrorMethods.BadRequestException);
    }
    finally {
      await queryRunner.release();
    }
  }

}
