import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Transform, Type } from 'class-transformer';
import { Column } from "typeorm";
import { ValidationEnumsDTOs } from "../../../common/enums/validations/validation-dto.enum";
import { ValidacionesDTOs } from "../../../common/validations/validation.function";

export class CreateComentariosPerfilJugadorDto {
    @IsNumber()
    informacionPersonalId: number;

    @IsNumber()
    autor: number;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Comentario'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Comentario', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
     @MaxLength(150,{
        message: ValidacionesDTOs({campo:'Comentario', maxLength: 150}, ValidationEnumsDTOs.maxLength),
    })
    comentario: string;
}
