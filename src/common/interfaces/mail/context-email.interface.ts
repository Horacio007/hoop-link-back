export interface IContextEmailCorreoBienvenida {
    enlaceConfirmacion: string,
    nombre: string
}

export interface IContextEmailCorreoRecuperacionContrasena {
    nombre: string,
    password: string,
    url: string
}