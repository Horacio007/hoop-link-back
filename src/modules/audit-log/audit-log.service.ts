import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { QueryRunner } from 'typeorm';
import { AuditLog } from '../../entities/AuditLog';

@Injectable()
export class AuditLogService {
// Método base para insertar el log usando el QueryRunner
  async log(
    queryRunner: QueryRunner,
    { tableName, id, action, before = null, after = null, user = null, ip = null }
  ) {
    try {

      console.log('esto es lo que llega a lo de auditoria:',{
        tabla: tableName,
        id_afectado: id,
        accion: action,
        datos_antes: before ? JSON.stringify(before) : null,
        datos_despues: after ? JSON.stringify(after) : null,
        usuario: user,
        ip: ip ?? '0.0.0.0',
      });

      const auditRepo = queryRunner.manager.getRepository(AuditLog);

      await auditRepo.insert({
        tabla: tableName,
        afectadoId: id,
        accion: action,
        datosAntes: before ?? null,
        datosDespues: after ?? null,
        usuarioId: user,
        ip: ip ?? '0.0.0.0',
      });
    } catch (error) {
      console.error('Error registrando auditoría:', error);
    }
  }

  // INSERT
  async insert(queryRunner: QueryRunner, { tableName, id, after, user, ip }) {
    return this.log(queryRunner, {
      tableName,
      id,
      action: 'INSERT',
      after,
      user,
      ip
    });
  }

  // UPDATE
  async update(queryRunner: QueryRunner, { tableName, id, before, after, user, ip }) {
    return this.log(queryRunner, {
      tableName,
      id,
      action: 'UPDATE',
      before,
      after,
      user,
      ip
    });
  }

  // DELETE
  async delete(queryRunner: QueryRunner, { tableName, id, before, user, ip }) {
    return this.log(queryRunner, {
      tableName,
      id,
      action: 'DELETE',
      before,
      user,
      ip
    });
  }
}
