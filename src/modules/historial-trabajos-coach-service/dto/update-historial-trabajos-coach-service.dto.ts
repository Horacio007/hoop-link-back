import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialTrabajosCoachServiceDto } from './create-historial-trabajos-coach-service.dto';

export class UpdateHistorialTrabajosCoachServiceDto extends PartialType(CreateHistorialTrabajosCoachServiceDto) {}
