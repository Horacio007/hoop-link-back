import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InformacionPersonal } from "./InformacionPersonal";

@Index(
  "FK_historial_eventos_informacion_personal",
  ["informacionPersonalId"],
  {}
)
@Entity("historial_equipos_informacion_personal", { schema: "hoop-link" })
export class HistorialEquiposInformacionPersonal {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "historial_equipos_informacion_personal_id",
  })
  historialEquiposInformacionPersonalId: number;

  @Column("int", { name: "informacion_personal_id" })
  informacionPersonalId: number;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre: string;

  @ManyToOne(
    () => InformacionPersonal,
    (informacionPersonal) =>
      informacionPersonal.historialEquiposInformacionPersonals,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    {
      name: "informacion_personal_id",
      referencedColumnName: "informacionPersonalId",
    },
  ])
  informacionPersonal: InformacionPersonal;
}
