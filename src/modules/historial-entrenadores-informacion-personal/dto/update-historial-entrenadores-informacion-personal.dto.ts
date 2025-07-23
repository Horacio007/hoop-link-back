import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialEntrenadoresInformacionPersonalDto } from './create-historial-entrenadores-informacion-personal.dto';

export class UpdateHistorialEntrenadoresInformacionPersonalDto extends PartialType(CreateHistorialEntrenadoresInformacionPersonalDto) {}
