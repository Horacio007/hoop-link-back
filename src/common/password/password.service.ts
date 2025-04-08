import { Injectable } from '@nestjs/common';
import * as generatePassword from 'generate-password';
import * as bcrypt from 'bcrypt';

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

    // Encriptar la contraseña
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10); // Generar un "salt"
        const hashedPassword = await bcrypt.hash(password, salt); // Encriptar la contraseña con el salt
        return hashedPassword;
    }
    
    // Verificar la contraseña con el hash guardado
    async validatePassword(password: string, hash: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hash); // Compara la contraseña con el hash guardado
        return isMatch;
    }

}
