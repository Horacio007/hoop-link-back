// upsert-informacion-personal.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CatalagoDTO } from '../../catalogo/dto/catalago.dto';
import { ValidationEnumsDTOs } from '../../../common/enums/validations/validation-dto.enum';
import { ValidacionesDTOs } from '../../../common/validations/validation.function';

export class PerfilDto {
    @IsOptional()
    @IsNumber()
    usuarioId?: number;
    
    @IsOptional()
    fotoPerfil?: string; // nombre del archivo o URL, si quieres validarla
    
    @IsOptional()
    @IsNumber()
    fotoPerfilId?: number; // nombre del archivo o URL, si quieres validarla

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Alias'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Alias', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    alias: string;
    
    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Altura'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Altura'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Altura', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    altura: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Peso'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Peso'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Peso', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    peso: number;
    
    @IsOptional()
    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Busqueda Jugador'}, ValidationEnumsDTOs.isNotEmpty)})
    @ValidateNested()
    @Type(() => CatalagoDTO)
    estatusBusquedaJugador: CatalagoDTO;
    
    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Medida de mano'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Medida de mano'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Medida de mano', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    medidaMano: number;
    
    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Largo del brazo'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Largo del brazo'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Largo del brazo', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    largoBrazo: number;
    
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Quien eres'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Quien eres', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    quienEres: string;

    @IsOptional()
    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Sexo'}, ValidationEnumsDTOs.isNotEmpty)})
    @ValidateNested()
    @Type(() => CatalagoDTO)
    sexo: CatalagoDTO;
}
