import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Estatus } from "./Estatus";
import { Rol } from "./Rol";
import { Usuario } from "./Usuario";

@Index("FK_tipo_usuario_estatus", ["estatusId"], {})
@Index("FK_tipo_usuario_rol", ["rolId"], {})
@Entity("tipo_usuario", { schema: "hoop-link" })
export class TipoUsuario {
  @PrimaryGeneratedColumn({ type: "int", name: "tipo_usuario_id" })
  tipoUsuarioId: number;

  @Column("int", { name: "estatus_id" })
  estatusId: number;

  @Column("int", { name: "rol_id" })
  rolId: number;

  @Column("varchar", { name: "nombre", length: 50 })
  nombre: string;

  @Column("varchar", { name: "descripcion", length: 100 })
  descripcion: string;

  @Column("datetime", { name: "fecha_creacion", default: () => "'now()'" })
  fechaCreacion: Date;

  @Column("int", { name: "usuario_creacion", nullable: true })
  usuarioCreacion: number | null;

  @Column("datetime", { name: "fecha_edicion", nullable: true })
  fechaEdicion: Date | null;

  @Column("int", { name: "usuario_edicion", nullable: true })
  usuarioEdicion: number | null;

  @ManyToOne(() => Estatus, (estatus) => estatus.tipoUsuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "estatus_id", referencedColumnName: "estatusId" }])
  estatus: Estatus;

  @ManyToOne(() => Rol, (rol) => rol.tipoUsuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "rol_id", referencedColumnName: "rolId" }])
  rol: Rol;

  @OneToMany(() => Usuario, (usuario) => usuario.tipoUsuario)
  usuarios: Usuario[];
}
