export interface JwtPayload {
    id: string;
    nombre: string;
    usuario: string;
    iat?:number;
    exp?:number;
}