import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InformacionPersonalCoach } from "./InformacionPersonalCoach";

@Index("FK_historial_trabajo_coach", ["informacionPersonalCoachId"], {})
@Entity("historial_trabajo_coach", { schema: "hoop-link" })
export class HistorialTrabajoCoach {
  @PrimaryGeneratedColumn({ type: "int", name: "historial_trabajo_coach" })
  historialTrabajoCoach: number;

  @Column("int", { name: "informacion_personal_coach_id" })
  informacionPersonalCoachId: number;

  @Column("varchar", { name: "nombre", length: 250 })
  nombre: string;

  @ManyToOne(
    () => InformacionPersonalCoach,
    (informacionPersonalCoach) =>
      informacionPersonalCoach.historialTrabajoCoaches,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    {
      name: "informacion_personal_coach_id",
      referencedColumnName: "informacionPersonalCoachId",
    },
  ])
  informacionPersonalCoach: InformacionPersonalCoach;
}
