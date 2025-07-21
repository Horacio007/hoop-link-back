import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ficheros } from "./Ficheros";
import { InformacionPersonal } from "./InformacionPersonal";
import { Municipio } from "./Municipio";
import { TipoUsuario } from "./TipoUsuario";
import { Estatus } from "./Estatus";

@Index("correo", ["correo"], { unique: true })
@Index("telefono", ["telefono"], { unique: true })
@Index("IDX_349ecb64acc4355db443ca17cb", ["correo"], { unique: true })
@Index("IDX_dd13ecd2eec69592d312b79392", ["telefono"], { unique: true })
@Index("FK_estatus_usuario", ["estatusId"], {})
@Index("FK_tipo_usuario_usuario", ["tipoUsuarioId"], {})
@Index("FK_municipio_usuario", ["municipioId"], {})
@Entity("usuario", { schema: "hoop-link" })
export class Usuario {
  @PrimaryGeneratedColumn({ type: "int", name: "usuario_id" })
  usuarioId: number;

  @Column("int", { name: "estatus_id" })
  estatusId: number;

  @Column("int", { name: "tipo_usuario_id" })
  tipoUsuarioId: number;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre: string;

  @Column("varchar", { name: "a_paterno", length: 100 })
  aPaterno: string;

  @Column("varchar", { name: "a_materno", length: 100 })
  aMaterno: string;

  @Column("datetime", { name: "fecha_nacimiento" })
  fechaNacimiento: Date;

  @Column("int", { name: "municipio_id" })
  municipioId: number;

  @Column("varchar", { name: "residencia", length: 100 })
  residencia: string;

  @Column("varchar", { name: "correo", unique: true, length: 100 })
  correo: string;

  @Column("varchar", { name: "telefono", unique: true, length: 100 })
  telefono: string;

  @Column("varchar", { name: "contrasena", length: 250 })
  contrasena: string;

  @Column("bit", { name: "verificado", default: () => "'0x00'" })
  verificado: boolean;

  @Column("timestamp", {
    name: "fecha_creacion",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date;

  @Column("int", { name: "usuario_creacion", nullable: true })
  usuarioCreacion: number | null;

  @Column("timestamp", { name: "fecha_edicion", nullable: true })
  fechaEdicion: Date | null;

  @Column("int", { name: "usuario_edicion", nullable: true })
  usuarioEdicion: number | null;

  @OneToMany(() => Ficheros, (ficheros) => ficheros.usuario)
  ficheros: Ficheros[];

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.usuario
  )
  informacionPersonals: InformacionPersonal[];

  @ManyToOne(() => Municipio, (municipio) => municipio.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "municipio_id", referencedColumnName: "municipioId" }])
  municipio: Municipio;

  @ManyToOne(() => TipoUsuario, (tipoUsuario) => tipoUsuario.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "tipo_usuario_id", referencedColumnName: "tipoUsuarioId" },
  ])
  tipoUsuario: TipoUsuario;

  @ManyToOne(() => Estatus, (estatus) => estatus.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "estatus_id", referencedColumnName: "estatusId" }])
  estatus: Estatus;
}
