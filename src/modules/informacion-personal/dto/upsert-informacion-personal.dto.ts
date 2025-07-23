// upsert-informacion-personal.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CatalagoDTO } from '../../catalogo/dto/catalago.dto';
import { ValidationEnumsDTOs } from '../../../common/enums/validations/validation-dto.enum';
import { ValidacionesDTOs } from '../../../common/validations/validation.function';
import { PerfilDto } from './perfil-dto';
import { FuerzaResistenciaDto } from './fuerza-resistencia-dto';
import { BasketballDto } from './basketball.dto';
import { ExperienciaDto } from './experiencia.dto';
import { VisionDto } from './vision.dto';

export class UpsertInformacionPersonalDto {

  @IsNotEmpty({message: ValidacionesDTOs({campo: 'perfil'}, ValidationEnumsDTOs.isNotEmpty)})
  perfil: PerfilDto;

  @IsNotEmpty({message: ValidacionesDTOs({campo: 'fuerzaResistencia'}, ValidationEnumsDTOs.isNotEmpty)})
  fuerzaResistencia: FuerzaResistenciaDto;

  @IsNotEmpty({message: ValidacionesDTOs({campo: 'BasketballDto'}, ValidationEnumsDTOs.isNotEmpty)})
  basketball: BasketballDto;

  @IsNotEmpty({message: ValidacionesDTOs({campo: 'ExperienciaDto'}, ValidationEnumsDTOs.isNotEmpty)})
  experiencia: ExperienciaDto;

  @IsNotEmpty({message: ValidacionesDTOs({campo: 'VisionDto'}, ValidationEnumsDTOs.isNotEmpty)})
  vision: VisionDto;
}
