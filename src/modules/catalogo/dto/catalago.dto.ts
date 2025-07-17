import { IsNumber, IsString, IsNotEmpty, Validate } from "class-validator";
import { ValidationEnumsDTOs } from "../../../common/enums/validations/validation-dto.enum";
import { ValidacionesDTOs } from "../../../common/validations/validation.function";
import { IsNumberOrStringConstraint } from "../../../common/validations/is-number-or-string.validator";

export class CatalagoDTO {
    @IsNotEmpty({message: ValidacionesDTOs({campo:'id'}, ValidationEnumsDTOs.isNotEmpty)})
    // @IsNumber({}, {message: ValidacionesDTOs({campo:'id'}, ValidationEnumsDTOs.isNumber)})
    @Validate(IsNumberOrStringConstraint) 
    id: number | string;

    @IsNotEmpty({message: ValidacionesDTOs({campo:'nombre'}, ValidationEnumsDTOs.isNotEmpty)})
    @IsString({message: ValidacionesDTOs({campo:'nombre'}, ValidationEnumsDTOs.isString)})
    nombre: string;
}