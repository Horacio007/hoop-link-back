import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InformacionPersonal } from "./InformacionPersonal";

@Entity("posicion_juego", { schema: "hoop-link" })
export class PosicionJuego {
  @PrimaryGeneratedColumn({ type: "int", name: "posicion_juego_id" })
  posicionJuegoId: number;

  @Column("varchar", { name: "nombre", length: 50, default: () => "'0'" })
  nombre: string;

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.posicionJuegoUno
  )
  informacionPersonals: InformacionPersonal[];

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.posicionJuegoDos
  )
  informacionPersonals2: InformacionPersonal[];
}
