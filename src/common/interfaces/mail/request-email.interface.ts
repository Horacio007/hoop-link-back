export interface IRequestEmail {
    destinatario: string,
    asunto: string,
    template: string,
    context?: any, 
    attachments?: any[]
}

export interface IRequestEmailBienvenida {
    destinatario: string,
    usuario: string,
    enlaceConfirmacion: string
}