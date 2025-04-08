import { ValidationEnumsDTOs } from "../enums/validations/validation-dto.enum";
import { IFiltroValidaciones } from "../interfaces/validations/validation.interface";

export function ValidacionesDTOs(filtro:IFiltroValidaciones, typeError:ValidationEnumsDTOs): string {
    switch (typeError) {
        case ValidationEnumsDTOs.isString:
            return `El campo ${filtro.campo} debe ser una cadena de texto.`;
            break;
        case ValidationEnumsDTOs.isNumber:
            return `El campo ${filtro.campo} debe ser un número.`;
            break;
        case ValidationEnumsDTOs.isBoolean:
            return `El campo ${filtro.campo} debe ser un valor booleano (true o false).`;
            break;
        case ValidationEnumsDTOs.isDate:
            return `El campo ${filtro.campo} debe ser una fecha válida.`;
            break;
        case ValidationEnumsDTOs.isArray:
            return `El campo ${filtro.campo} debe ser un arreglo.`;
            break;
        case ValidationEnumsDTOs.isObject:
            return `El campo ${filtro.campo} debe ser un objeto.`;
            break;
        case ValidationEnumsDTOs.minLength:
            return `El campo ${filtro.campo} debe tener al menos ${filtro.minLength} caracteres.`;
        case ValidationEnumsDTOs.maxLength:
            return `El campo ${filtro.campo} debe tener máximo ${filtro.maxLength} caracteres.`;
            break;
        case ValidationEnumsDTOs.length:
            if (filtro.minLength && !filtro.maxLength) {
                return `El campo ${filtro.campo} debe tener ${filtro.minLength} caracteres.`;
            } else {
                return `El campo ${filtro.campo} debe tener entre ${filtro.minLength} y ${filtro.maxLength} caracteres.`;
            }
            break;
        case ValidationEnumsDTOs.isEmail:
            return `El campo ${filtro.campo} debe ser un correo electrónico válido.`;
            break;
        case ValidationEnumsDTOs.isUUID:
            return `El campo ${filtro.campo} debe ser un UUID válido.`;
            break;
        case ValidationEnumsDTOs.matches:
            return `El campo ${filtro.campo} debe coincidir con el formato requerido.`;
            break;
        case ValidationEnumsDTOs.min:
            return `El campo ${filtro.campo} no debe ser menor que ${filtro.minLength}.`;
            break;
        case ValidationEnumsDTOs.max:
            return `El campo ${filtro.campo} no debe ser mayor que ${filtro.maxLength}.`;
            break;
        case ValidationEnumsDTOs.isPositive:
            return `El campo ${filtro.campo} debe ser un número positivo.`;
            break;
        case ValidationEnumsDTOs.isNegative:
            return `El campo ${filtro.campo} debe ser un número negativo.`;
            break; 
        case ValidationEnumsDTOs.isInt:
            return `El campo ${filtro.campo} debe ser un número entero.`;
            break;
        case ValidationEnumsDTOs.isDecimal:
            return `El campo ${filtro.campo} debe ser un número decimal.`;
            break;
        case ValidationEnumsDTOs.isNotEmpty:
            return `El campo ${filtro.campo} no debe estar vacío.`;
            break;
        default:
            return `Excepcion no controlada.`;
            break;
    }
}