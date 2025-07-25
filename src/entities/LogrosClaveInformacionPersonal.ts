import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InformacionPersonal } from "./InformacionPersonal";

@Index("FK_logros_clave_informacion_personal", ["informacionPersonalId"], {})
@Entity("logros_clave_informacion_personal", { schema: "hoop-link" })
export class LogrosClaveInformacionPersonal {
  @PrimaryGeneratedColumn({ type: "int", name: "logros_clave_id" })
  logrosClaveId: number;

  @Column("int", { name: "informacion_personal_id" })
  informacionPersonalId: number;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre: string;

  @ManyToOne(
    () => InformacionPersonal,
    (informacionPersonal) =>
      informacionPersonal.logrosClaveInformacionPersonals,
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
