import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Entidad } from "./Entidad";
import { Ficheros } from "./Ficheros";
import { TipoUsuario } from "./TipoUsuario";
import { Usuario } from "./Usuario";

@Index("FK_entidad_estatus", ["entidadId"], {})
@Entity("estatus", { schema: "hoop-link" })
export class Estatus {
  @PrimaryGeneratedColumn({ type: "int", name: "estatus_id" })
  estatusId: number;

  @Column("int", { name: "entidad_id" })
  entidadId: number;

  @Column("varchar", { name: "nombre", length: 50 })
  nombre: string;

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

  @ManyToOne(() => Entidad, (entidad) => entidad.estatuses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "entidad_id", referencedColumnName: "entidadId" }])
  entidad: Entidad;

  @OneToMany(() => Ficheros, (ficheros) => ficheros.estatus)
  ficheros: Ficheros[];

  @OneToMany(() => TipoUsuario, (tipoUsuario) => tipoUsuario.estatus)
  tipoUsuarios: TipoUsuario[];

  @OneToMany(() => Usuario, (usuario) => usuario.estatus)
  usuarios: Usuario[];
}
