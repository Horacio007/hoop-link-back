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
  "FK_historial_entrenadores_informacion_personal",
  ["informacionPersonalId"],
  {}
)
@Entity("historial_entrenadores_informacion_personal", { schema: "hoop-link" })
export class HistorialEntrenadoresInformacionPersonal {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "historial_entrenadores_informacion_personal_id",
  })
  historialEntrenadoresInformacionPersonalId: number;

  @Column("int", { name: "informacion_personal_id" })
  informacionPersonalId: number;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre: string;

  @ManyToOne(
    () => InformacionPersonal,
    (informacionPersonal) =>
      informacionPersonal.historialEntrenadoresInformacionPersonals,
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
