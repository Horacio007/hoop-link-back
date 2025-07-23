import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialEventosInformacionPersonalDto } from './create-historial-eventos-informacion-personal.dto';

export class UpdateHistorialEventosInformacionPersonalDto extends PartialType(CreateHistorialEventosInformacionPersonalDto) {}
