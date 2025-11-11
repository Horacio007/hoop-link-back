import { IsString, MinLength, IsOptional } from 'class-validator';
import { Transform, Type } from "class-transformer";
import { ValidationEnumsDTOs } from "../../../common/enums/validations/validation-dto.enum";
import { ValidacionesDTOs } from "../../../common/validations/validation.function";

export class RedesSocialesDto {
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Facebook'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Facebook', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    facebook: string;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Instagram'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Instagram', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    instagram: string;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'TikTok'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'TikTok', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    tiktok: string;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Youtube'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Youtube', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    youtube: string;
}