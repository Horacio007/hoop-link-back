import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogoDto } from './create-catalogo.dto';

export class UpdateCatalogoDto extends PartialType(CreateCatalogoDto) {}
