import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CatalagoDTO } from '../../catalogo/dto/catalago.dto';
import { ValidationEnumsDTOs } from '../../../common/enums/validations/validation-dto.enum';
import { ValidacionesDTOs } from '../../../common/validations/validation.function';

export class FuerzaResistenciaDto {
    @IsOptional()
    @IsNumber()
    usuarioId?: number;

    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Altura en salto vertical'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Altura en salto vertical'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Altura en salto vertical', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    alturaSaltoVertical?: number;

    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Distancia en salto horizontal'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Distancia en salto horizontal'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Distancia en salto horizontal', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    distanciaSaltoHorizontal?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Peso máximo en bench press'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Peso máximo en bench press'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Peso máximo en bench press', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    pesoBenchPress?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Peso máximo en squats'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Peso máximo en squats'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Peso máximo en squats', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    pesoSquats?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Peso máximo en press militar'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Peso máximo en press militar'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Peso máximo en press militar', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    pesoPressMilitar?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Peso máximo en 10 repeticiones de bench press'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Peso máximo en 10 repeticiones de bench press'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Peso máximo en 10 repeticiones de bench press', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    pesoRepeticionBenchPress?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Peso máximo en 10 repeticiones de squats'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Peso máximo en 10 repeticiones de squats'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Peso máximo en 10 repeticiones de squats', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    pesoRepeticionSquats?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Peso máximo en 10 repeticiones de press militar'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Peso máximo en 10 repeticiones de press militar'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Peso máximo en 10 repeticiones de press militar', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    pesoRepeticionPressMilitar?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Tiempo en 100 mts'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Tiempo en 100 mts'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Tiempo en 100 mts', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    tiempoDistanciaCienMts?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Tiempo en 1 km'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Tiempo en 1 km'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Tiempo en 1 km', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    tiempoDistanciaUnKm?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Tiempo en 3 km'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Tiempo en 3 km'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Tiempo en 3 km', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    tiempoDistanciaTresKm?: number;

    @IsOptional()
    @IsNumber({},{
        message: ValidacionesDTOs({campo: 'Tiempo en 5 km'}, ValidationEnumsDTOs.max)
    })
    @IsPositive({
        message: ValidacionesDTOs({campo: 'Tiempo en 5 km'}, ValidationEnumsDTOs.isPositive)
    })
    @Min(1, {
        message: ValidacionesDTOs({ campo: 'Tiempo en 5 km', minLength: 1 }, ValidationEnumsDTOs.min),
    })
    tiempoDistanciaCincoKm?: number;
}