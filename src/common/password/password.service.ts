import { Injectable } from '@nestjs/common';
import * as generatePassword from 'generate-password';

@Injectable()
export class PasswordService {

    generateRandomPassword(): string {
        return generatePassword.generate({
            length: 10, // Longitud de la contraseña
            numbers: true, // Incluye números
            // symbols: true, // Incluye símbolos especiales
            // uppercase: true, // Incluye letras mayúsculas
            // lowercase: true, // Incluye letras minúsculas
            // excludeSimilarCharacters: true, // Excluye caracteres similares como 'i' y 'l'
        });
    }

}
