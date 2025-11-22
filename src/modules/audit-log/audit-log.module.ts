import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../../entities/AuditLog';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [AuditLogController],
  providers: [AuditLogService],
  imports: [
    TypeOrmModule.forFeature([
      AuditLog
    ]),
    CommonModule
  ],
  exports: [AuditLogService]
})
export class AuditLogModule {}
