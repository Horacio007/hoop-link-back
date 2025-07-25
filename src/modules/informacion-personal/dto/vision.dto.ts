import { IsOptional, IsString, MinLength } from "class-validator";
import { Transform, Type } from 'class-transformer';
import { ValidationEnumsDTOs } from "../../../common/enums/validations/validation-dto.enum";
import { ValidacionesDTOs } from "../../../common/validations/validation.function";

export class VisionDto {

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Objetivos'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Objetivos', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    objetivos: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Valores'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Valores', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    valores: string;
}