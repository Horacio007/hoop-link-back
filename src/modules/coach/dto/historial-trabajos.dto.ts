import { IsString, MinLength, IsOptional } from 'class-validator';
import { Transform, Type } from "class-transformer";
import { ValidationEnumsDTOs } from "../../../common/enums/validations/validation-dto.enum";
import { ValidacionesDTOs } from "../../../common/validations/validation.function";

export class HistorialTrabajosDto {

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Nombre del trabajo'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Nombre del trabajo', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    nombre: string;
}