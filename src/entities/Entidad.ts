import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Estatus } from "./Estatus";

@Entity("entidad", { schema: "hoop-link" })
export class Entidad {
  @PrimaryGeneratedColumn({ type: "int", name: "entidad_id" })
  entidadId: number;

  @Column("varchar", { name: "nombre", length: 50 })
  nombre: string;

  @Column("datetime", {
    name: "fecha_creacion",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date;

  @Column("int", { name: "usuario_creacion_id", nullable: true })
  usuarioCreacionId: number | null;

  @Column("datetime", { name: "fecha_edicion", nullable: true })
  fechaEdicion: Date | null;

  @Column("int", { name: "usuario_edicion_id", nullable: true })
  usuarioEdicionId: number | null;

  @OneToMany(() => Estatus, (estatus) => estatus.entidad)
  estatuses: Estatus[];
}
