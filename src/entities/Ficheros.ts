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
import { Usuario } from "./Usuario";
import { InformacionPersonal } from "./InformacionPersonal";

@Index("FK_ficheros_estatus", ["estatusId"], {})
@Index("FK_ficheros_usuario", ["usuarioId"], {})
@Entity("ficheros", { schema: "hoop-link" })
export class Ficheros {
  @PrimaryGeneratedColumn({ type: "int", name: "fichero_id" })
  ficheroId: number;

  @Column("int", { name: "estatus_id" })
  estatusId: number;

  @Column("int", { name: "usuario_id" })
  usuarioId: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 100 })
  nombre: string | null;

  @Column("varchar", { name: "folder_id", length: 50 })
  folderId: string;

  @Column("varchar", { name: "archivo_id", length: 200 })
  archivoId: string;

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

  @ManyToOne(() => Estatus, (estatus) => estatus.ficheros, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "estatus_id", referencedColumnName: "estatusId" }])
  estatus: Estatus;

  @ManyToOne(() => Usuario, (usuario) => usuario.ficheros, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "usuario_id", referencedColumnName: "usuarioId" }])
  usuario: Usuario;

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.videoJugando
  )
  informacionPersonals: InformacionPersonal[];

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.videoColada
  )
  informacionPersonals2: InformacionPersonal[];

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.videoBotando
  )
  informacionPersonals3: InformacionPersonal[];

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.fotoPerfil
  )
  informacionPersonals4: InformacionPersonal[];

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.videoEntrenando
  )
  informacionPersonals5: InformacionPersonal[];

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.videoTirando
  )
  informacionPersonals6: InformacionPersonal[];
}
