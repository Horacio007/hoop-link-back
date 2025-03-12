import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permiso } from "./Permiso";
import { TipoUsuario } from "./TipoUsuario";

@Entity("rol", { schema: "hoop-link" })
export class Rol {
  @PrimaryGeneratedColumn({ type: "int", name: "rol_id" })
  rolId: number;

  @Column("varchar", { name: "nombre", length: 50 })
  nombre: string;

  @Column("varchar", { name: "descripcion", length: 100 })
  descripcion: string;

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

  @OneToMany(() => Permiso, (permiso) => permiso.rol)
  permisos: Permiso[];

  @OneToMany(() => TipoUsuario, (tipoUsuario) => tipoUsuario.rol)
  tipoUsuarios: TipoUsuario[];
}
