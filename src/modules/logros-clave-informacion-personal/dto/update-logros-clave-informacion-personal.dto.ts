import { PartialType } from '@nestjs/mapped-types';
import { CreateLogrosClaveInformacionPersonalDto } from './create-logros-clave-informacion-personal.dto';

export class UpdateLogrosClaveInformacionPersonalDto extends PartialType(CreateLogrosClaveInformacionPersonalDto) {}
