import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Index("FK_entrenador_id_usuario_id", ["entrenadorId"], {})
@Index("FK_jugador_id_usuario_id", ["jugadorId"], {})
@Entity("vista_jugador_perfil", { schema: "hoop-link" })
export class VistaJugadorPerfil {
  @PrimaryGeneratedColumn({ type: "int", name: "vista_jugador_perfil_id" })
  vistaJugadorPerfilId: number;

  @Column("int", { name: "entrenador_id" })
  entrenadorId: number;

  @Column("int", { name: "jugador_id" })
  jugadorId: number;

  @Column("datetime", { name: "fecha_creacion", default: () => "'now()'" })
  fechaCreacion: Date;

  @Column("varchar", { name: "usuario_creacion", length: 50 })
  usuarioCreacion: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.vistaJugadorPerfils, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "entrenador_id", referencedColumnName: "usuarioId" }])
  entrenador: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.vistaJugadorPerfils2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "jugador_id", referencedColumnName: "usuarioId" }])
  jugador: Usuario;
}
