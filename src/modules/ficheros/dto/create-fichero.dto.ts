import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFicheroDto {
    @IsOptional()
    @IsString()
    publicId: string;

    @IsNumber()
    ficheroId: number
}
