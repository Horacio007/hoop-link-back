import { ICatalogo } from "../../../modules/catalogo/interfaces/catalogo.interface";

export interface IInformacinPersonal {
    informacionPersonalId: number,
    fotoPerfilId: number,
    altura: number,
    peso: number,
    estatusBusquedaJugador: ICatalogo,
    medidaMano: number,
    largoBrazo: number,
    quienEres: string,
    fotoPerfilPublicUrl: string
}