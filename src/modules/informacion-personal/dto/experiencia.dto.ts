import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsDate, IsNumber, IsOptional, IsPositive, Min, IsBoolean, IsString, MinLength, IsArray, ValidateNested } from "class-validator";
import { ValidationEnumsDTOs } from "../../../common/enums/validations/validation-dto.enum";
import { ValidacionesDTOs } from "../../../common/validations/validation.function";
import { HistorialEntrenadoresDto } from "./historial-entrenadores.dto";
import { HistorialEquiposDto } from "./historial-equipos.dto";
import { LogrosClaveDto } from "./logros-clave.dto";

export class ExperienciaDto {
    @IsOptional()
    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Desde cuando juegas'}, ValidationEnumsDTOs.isNotEmpty)})
    @Type(() => Date)  // ✅ Convierte el string recibido en una instancia de Date
    @IsDate({message: ValidacionesDTOs({campo: 'Desde cuando juegas'}, ValidationEnumsDTOs.isDate)})
    desdeCuandoJuegas:Date;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Horas de entrenamiento por semana'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Horas de entrenamiento por semana'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Horas de entrenamiento por semana', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    horasEntrenamientoSemana?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Horas de gimnasio por semana'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Horas de gimnasio por semana'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Horas de gimnasio por semana', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    horasGymSemana?: number;

    @IsBoolean({message: ValidacionesDTOs({campo: 'Perteneces a un club'}, ValidationEnumsDTOs.isBoolean)})
    pertenecesClub: boolean;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Nombre del club'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Nombre del club', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    nombreClub: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HistorialEquiposDto) // ← Necesario para transformar correctamente los objetos
    historialEquipos:HistorialEquiposDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HistorialEntrenadoresDto) // ← Necesario para transformar correctamente los objetos
    historialEntrenadores:HistorialEntrenadoresDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LogrosClaveDto) // ← Necesario para transformar correctamente los objetos
    logrosClave:LogrosClaveDto[];
}