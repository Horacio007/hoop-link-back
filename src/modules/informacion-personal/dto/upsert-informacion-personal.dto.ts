// upsert-informacion-personal.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CatalagoDTO } from '../../catalogo/dto/catalago.dto';
import { ValidationEnumsDTOs } from '../../../common/enums/validations/validation-dto.enum';
import { ValidacionesDTOs } from '../../../common/validations/validation.function';
import { PerfilDto } from './perfil-dto';
import { FuerzaResistenciaDto } from './fuerza-resistencia-dto';

export class UpsertInformacionPersonalDto {

  @IsNotEmpty({message: ValidacionesDTOs({campo: 'perfil'}, ValidationEnumsDTOs.isNotEmpty)})
  perfil: PerfilDto;

  @IsNotEmpty({message: ValidacionesDTOs({campo: 'fuerzaResistencia'}, ValidationEnumsDTOs.isNotEmpty)})
  fuerzaResistencia: FuerzaResistenciaDto;
}
