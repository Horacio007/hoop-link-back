import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ValidationEnumsDTOs } from "../../common/enums/validations/validation-dto.enum";
import { ValidacionesDTOs } from "../../common/validations/validation.function";
import { Transform, Type } from "class-transformer";

export class LoginUserDTO {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsEmail({}, {message: ValidacionesDTOs({campo:'Correo'}, ValidationEnumsDTOs.isEmail)})
    correo:string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MinLength(1)
    @MaxLength(1024)
    contrasena: string;
}