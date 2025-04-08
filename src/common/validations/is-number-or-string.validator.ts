import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isNumberOrString', async: false })
export class IsNumberOrStringConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // Aceptamos tanto números como cadenas de texto
    return typeof value === 'number' || typeof value === 'string';
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} debe ser un número o una cadena de texto.`;  // Mensaje de error
  }
}
