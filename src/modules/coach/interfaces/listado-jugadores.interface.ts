export interface IListadoJugadores {
    informacionPersonalId: number,
    fotoPerfil?: string,
    alias?: string,
    nombre:string,
    aPaterno:string,
    aMaterno:string,
    altura?: number,
    peso?: number,
    estatus?: string,
    manoJuego?: string ,
    posicionJuegoUno?: string ,
    posicionJuegoDos?: string ,
    sexo?: string,
    estado: string,
    municipio: string,
    interesado: boolean
}