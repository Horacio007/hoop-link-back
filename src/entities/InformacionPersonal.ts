import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EstatusBusquedaJugador } from "./EstatusBusquedaJugador";
import { Usuario } from "./Usuario";
import { Ficheros } from "./Ficheros";

@Index(
  "FK_informacion_personal_estatus_busqueda_jugador",
  ["estatusBusquedaJugadorId"],
  {}
)
@Index("FK_informacion_personal_foto_perfil_ficheros", ["fotoPerfilId"], {})
@Index("FK_informacion_personal_usuario", ["usuarioId"], {})
@Entity("informacion_personal", { schema: "hoop-link" })
export class InformacionPersonal {
  @PrimaryGeneratedColumn({ type: "int", name: "informacion_personal_id" })
  informacionPersonalId: number;

  @Column("int", { name: "usuario_id" })
  usuarioId: number;

  @Column("int", { name: "foto_perfil_id", nullable: true })
  fotoPerfilId: number | null;

  @Column("float", { name: "altura", precision: 12 })
  altura: number;

  @Column("float", { name: "peso", precision: 12 })
  peso: number;

  @Column("int", { name: "estatus_busqueda_jugador_id" })
  estatusBusquedaJugadorId: number;

  @Column("float", { name: "medida_mano", precision: 12 })
  medidaMano: number;

  @Column("float", { name: "largo_brazo", precision: 12 })
  largoBrazo: number;

  @Column("varchar", { name: "quien_eres", length: 500 })
  quienEres: string;

  @Column("datetime", {
    name: "fechaCreacion",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date;

  @Column("int", {
    name: "usuarioCreacion",
    nullable: true,
    default: () => "'0'",
  })
  usuarioCreacion: number | null;

  @Column("timestamp", { name: "fechaEdicion", nullable: true })
  fechaEdicion: Date | null;

  @Column("int", { name: "usuarioEdicion", nullable: true })
  usuarioEdicion: number | null;

  @ManyToOne(
    () => EstatusBusquedaJugador,
    (estatusBusquedaJugador) => estatusBusquedaJugador.informacionPersonals,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    {
      name: "estatus_busqueda_jugador_id",
      referencedColumnName: "estatusBusquedaJugadorId",
    },
  ])
  estatusBusquedaJugador: EstatusBusquedaJugador;

  @ManyToOne(() => Usuario, (usuario) => usuario.informacionPersonals, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "usuario_id", referencedColumnName: "usuarioId" }])
  usuario: Usuario;

  @ManyToOne(() => Ficheros, (ficheros) => ficheros.informacionPersonals, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "foto_perfil_id", referencedColumnName: "ficheroId" }])
  fotoPerfil: Ficheros;
}
