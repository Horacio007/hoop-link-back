import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsPositive, Min, ValidateNested } from "class-validator";
import { ValidationEnumsDTOs } from "../../../common/enums/validations/validation-dto.enum";
import { ValidacionesDTOs } from "../../../common/validations/validation.function";
import { CatalagoDTO } from "../../catalogo/dto/catalago.dto";
import { ICatalogo } from "../../catalogo/interfaces/catalogo.interface";

export class BasketballDto {
    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Año que empezo a jugar'}, ValidationEnumsDTOs.isNotEmpty)})
    @Type(() => Date)  // ✅ Convierte el string recibido en una instancia de Date
    @IsDate({message: ValidacionesDTOs({campo: 'Año que empezo a jugar'}, ValidationEnumsDTOs.isDate)})
    anioEmpezoAJugar:Date;
    
    @IsBoolean({message: ValidacionesDTOs({campo: 'Mano de juego'}, ValidationEnumsDTOs.isBoolean)})
    manoJuego: boolean;

    // ✅ Agregar estas propiedades para evitar errores
    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Posición de juego uno'}, ValidationEnumsDTOs.isNotEmpty)})
    @ValidateNested()  // 🔥 Valida que sea un objeto con validaciones internas
    @Type(() => CatalagoDTO)  // 🔥 Convierte el objeto JSON a una instancia de ICatalogoDto
    posicionJuegoUno: ICatalogo;

    // ✅ Agregar estas propiedades para evitar errores
    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Posición de juego dos'}, ValidationEnumsDTOs.isNotEmpty)})
    @ValidateNested()  // 🔥 Valida que sea un objeto con validaciones internas
    @Type(() => CatalagoDTO)  // 🔥 Convierte el objeto JSON a una instancia de ICatalogoDto
    posicionJuegoDos: ICatalogo;

    @IsBoolean({message: ValidacionesDTOs({campo: 'Clavas'}, ValidationEnumsDTOs.isBoolean)})
    clavas: boolean;

    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Puntos promedio por juego'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Puntos promedio por juego'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Puntos promedio por juego', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    puntosPorJuego?: number;

    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Asistencias promedio por juego'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Asistencias promedio por juego'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Asistencias promedio por juego', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    asistenciasPorJuego?: number;

    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Rebotes promedio por juego'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Rebotes promedio por juego'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Rebotes promedio por juego', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    rebotesPorJuego?: number;

     @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Porcentaje de tiros de media'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Porcentaje de tiros de media'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Porcentaje de tiros de media', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    porcentajeTirosMedia?: number;

     @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Porcentaje de tiros de tres'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Porcentaje de tiros de tres'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Porcentaje de tiros de tres', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    porcentajeTirosTres?: number;

     @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Porcentajes de tiros libresx'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Porcentajes de tiros libresx'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Porcentajes de tiros libresx', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    porcentajeTirosLibres?: number;
}