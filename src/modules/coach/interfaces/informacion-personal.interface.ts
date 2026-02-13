import { IHistorialTrabajoCoach } from "./historial-entrenadores.ip.interface";

export interface IInformacionPersonalCoach {
    informacionPersonalCoachId: number,
    fotoPerfilId: number,
    coachId: number,
    trabajoActual: string,
    personalidad: string,
    valores: string,
    objetivos: string,
    historialTrabajoCoaches?: IHistorialTrabajoCoach[] ,
    fotoPerfilPublicUrl: string,
    antiguedad: number
}