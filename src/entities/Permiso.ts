import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Rol } from "./Rol";

@Index("FK_rol_permiso", ["rolId"], {})
@Entity("permiso", { schema: "hoop-link" })
export class Permiso {
  @PrimaryGeneratedColumn({ type: "int", name: "permiso_id" })
  permisoId: number;

  @Column("int", { name: "rol_id" })
  rolId: number;

  @Column("bit", { name: "total", default: () => "'0'" })
  total: boolean;

  @Column("datetime", {
    name: "fecha_creacion",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date;

  @Column("int", { name: "usuario_creacion", nullable: true })
  usuarioCreacion: number | null;

  @Column("datetime", { name: "fecha_edicion", nullable: true })
  fechaEdicion: Date | null;

  @Column("int", { name: "usuario_edicion", nullable: true })
  usuarioEdicion: number | null;

  @ManyToOne(() => Rol, (rol) => rol.permisos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "rol_id", referencedColumnName: "rolId" }])
  rol: Rol;
}
