// upsert-informacion-personal.dto.ts
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ValidationEnumsDTOs } from '../../../common/enums/validations/validation-dto.enum';
import { ValidacionesDTOs } from '../../../common/validations/validation.function';
import { HistorialTrabajosDto } from './historial-trabajos.dto';

export class UpsertInformacionPersonalDto {

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
      message: ValidacionesDTOs({campo:'Trabajo actual'}, ValidationEnumsDTOs.isString)
  })
  @MinLength(1,{
      message: ValidacionesDTOs({campo:'Trabajo actual', minLength: 1}, ValidationEnumsDTOs.minLength),
  })
  trabajoActual: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
      message: ValidacionesDTOs({campo:'Personalidad'}, ValidationEnumsDTOs.isString)
  })
  @MinLength(1,{
      message: ValidacionesDTOs({campo:'Personalidad', minLength: 1}, ValidationEnumsDTOs.minLength),
  })
  personalidad: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
      message: ValidacionesDTOs({campo:'Valores'}, ValidationEnumsDTOs.isString)
  })
  @MinLength(1,{
      message: ValidacionesDTOs({campo:'Valores', minLength: 1}, ValidationEnumsDTOs.minLength),
  })
  valores: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
      message: ValidacionesDTOs({campo:'Objetivos'}, ValidationEnumsDTOs.isString)
  })
  @MinLength(1,{
      message: ValidacionesDTOs({campo:'Objetivos', minLength: 1}, ValidationEnumsDTOs.minLength),
  })
  objetivos: string;

  @IsOptional()
  @IsNumber({},{
      message: ValidacionesDTOs({campo: 'Antiguedad'}, ValidationEnumsDTOs.max)
  })
  @IsPositive({
      message: ValidacionesDTOs({campo: 'Antiguedad'}, ValidationEnumsDTOs.isPositive)
  })
  @Min(1, {
      message: ValidacionesDTOs({ campo: 'Antiguedad', minLength: 1 }, ValidationEnumsDTOs.min),
  })
  antiguedad?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistorialTrabajosDto) // ← Necesario para transformar correctamente los objetos
  historialTrabajoCoaches:HistorialTrabajosDto[];

}
