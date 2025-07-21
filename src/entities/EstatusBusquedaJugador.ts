import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InformacionPersonal } from "./InformacionPersonal";

@Entity("estatus_busqueda_jugador", { schema: "hoop-link" })
export class EstatusBusquedaJugador {
  @PrimaryGeneratedColumn({ type: "int", name: "estatus_busqueda_jugador_id" })
  estatusBusquedaJugadorId: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 100 })
  nombre: string | null;

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.estatusBusquedaJugador
  )
  informacionPersonals: InformacionPersonal[];
}
