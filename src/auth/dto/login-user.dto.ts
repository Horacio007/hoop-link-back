import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDTO {
    @IsString()
    @IsEmail()
    @MinLength(5)
    @MaxLength(255)
    usuario:string;

    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    // TODO: preguntar si agregamos un patron a la hora de crear la contraseña 
    // @Matches(
    //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    // message: 'The password must have a Uppercase, lowercase letter and a number'
    // })
    password: string;
}