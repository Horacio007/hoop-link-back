import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength, MinLength, ValidateNested } from "class-validator";
import { ICatalogo } from "../../catalogo/interfaces/catalogo.interface";
import { Transform, Type } from "class-transformer";
import { CatalagoDTO } from "../../catalogo/dto/catalago.dto";
import { ValidacionesDTOs } from "../../../common/validations/validation.function";
import { ValidationEnumsDTOs } from '../../../common/enums/validations/validation-dto.enum';

export class CreateUsuarioDto {
    
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Nombre'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Nombre', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    nombre:string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Apellido Paterno'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Apellido Paterno', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    apellidoPaterno:string;
    
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Apellido Materno'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Apellido Materno', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    apellidoMaterno:string;

    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Fecha de Nacimiento'}, ValidationEnumsDTOs.isNotEmpty)})
    @Type(() => Date)  // ✅ Convierte el string recibido en una instancia de Date
    @IsDate({message: ValidacionesDTOs({campo: 'Fecha de Nacimiento'}, ValidationEnumsDTOs.isDate)})
    fechaNacimiento:Date;

    // ✅ Agregar estas propiedades para evitar errores
    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Estado'}, ValidationEnumsDTOs.isNotEmpty)})
    @ValidateNested()  // 🔥 Valida que sea un objeto con validaciones internas
    @Type(() => CatalagoDTO)  // 🔥 Convierte el objeto JSON a una instancia de ICatalogoDto
    estado: ICatalogo;

    @IsNotEmpty({message: ValidacionesDTOs({campo: 'Municipio'}, ValidationEnumsDTOs.isNotEmpty)})
    @ValidateNested()  // 🔥 Valida que sea un objeto con validaciones internas
    @Type(() => CatalagoDTO)  // 🔥 Convierte el objeto JSON a una instancia de ICatalogoDto
    municipio:ICatalogo;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Residencia'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Residencia', minLength: 1}, ValidationEnumsDTOs.minLength),
    })
    residencia:string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsEmail({}, {message: ValidacionesDTOs({campo:'Correo'}, ValidationEnumsDTOs.isEmail)})
    correo:string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Telefono'}, ValidationEnumsDTOs.isString)
    })
    @Length(12, 12, {
        message: ValidacionesDTOs({campo:'Telefono', minLength: 12}, ValidationEnumsDTOs.length)
    })
    telefono:string;

    @IsNotEmpty({message: ValidacionesDTOs({campo:'Tipo Usuario'}, ValidationEnumsDTOs.isNotEmpty)})
    @ValidateNested()  // 🔥 Valida que sea un objeto con validaciones internas
    @Type(() => CatalagoDTO)  // 🔥 Convierte el objeto JSON a una instancia de ICatalogoDto
    tipoUsuario:CatalagoDTO;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({
        message: ValidacionesDTOs({campo:'Contraseña'}, ValidationEnumsDTOs.isString)
    })
    @MinLength(1,{
        message: ValidacionesDTOs({campo:'Contraseña', minLength: 8}, ValidationEnumsDTOs.minLength),
    })
    contrasena:string;

    @IsBoolean({message: ValidacionesDTOs({campo: 'Acepta Terminos y Condiciones'}, ValidationEnumsDTOs.isBoolean)})
    aceptaTerminos: boolean;
}
