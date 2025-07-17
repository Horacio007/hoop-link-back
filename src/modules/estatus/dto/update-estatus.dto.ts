import { PartialType } from '@nestjs/mapped-types';
import { CreateEstatusDto } from './create-estatus.dto';

export class UpdateEstatusDto extends PartialType(CreateEstatusDto) {}
