export interface IRequestEmail {
    destinatario: string,
    asunto: string,
    template: string,
    context?: any, 
    attachments?: any[],
    tipoGif: string
}

export interface IRequestEmailBienvenida {
    destinatario: string,
    usuario: string,
    enlaceConfirmacion: string
}

export interface IRequestEmailRecuperaContrasena {
    destinatario: string,
    usuario: string,
    password: string,
    url: string
}