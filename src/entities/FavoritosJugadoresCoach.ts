import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Index("favoritos_jugadores_coach_usuario_jugador", ["jugadorId"], {})
@Index("favoritos_jugadores_coach_usuario_coach", ["coachId"], {})
@Entity("favoritos_jugadores_coach", { schema: "hoop-link" })
export class FavoritosJugadoresCoach {
  @PrimaryGeneratedColumn({ type: "int", name: "favoritos_jugadores_coach_id" })
  favoritosJugadoresCoachId: number;

  @Column("int", { name: "coach_id", default: () => "'0'" })
  coachId: number;

  @Column("int", { name: "jugador_id", default: () => "'0'" })
  jugadorId: number;

  @Column("bit", { name: "interesado", default: () => "'1'" })
  interesado: boolean;

  @Column("int", { name: "usuario_creacion" })
  usuarioCreacion: number;

  @Column("datetime", {
    name: "fecha_creacion",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date;

  @Column("int", { name: "usuario_edicion", nullable: true })
  usuarioEdicion: number | null;

  @Column("datetime", { name: "fecha_edicion", nullable: true })
  fechaEdicion: Date | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.favoritosJugadoresCoaches, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "coach_id", referencedColumnName: "usuarioId" }])
  coach: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.favoritosJugadoresCoaches2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "jugador_id", referencedColumnName: "usuarioId" }])
  jugador: Usuario;
}
