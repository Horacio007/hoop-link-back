import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Index(
  "FK_perfil_comentado_jugador_id_usuario_id",
  ["perfilComentadoJugadorId"],
  {}
)
@Index("FK_autor_comentario_id_usuario_id", ["autorComentarioId"], {})
@Entity("comentarios_perfil_jugador", { schema: "hoop-link" })
export class ComentariosPerfilJugador {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "comentarios_perfil_jugador_id",
  })
  comentariosPerfilJugadorId: number;

  @Column("int", { name: "autor_comentario_id" })
  autorComentarioId: number;

  @Column("int", { name: "perfil_comentado_jugador_id" })
  perfilComentadoJugadorId: number;

  @Column("bit", {
    name: "autor",
    comment: "0 coach, 1 jugador",
    default: () => "'b'0''",
  })
  autor: boolean;

  @Column("varchar", { name: "comentario", length: 150 })
  comentario: string;

  @Column("bit", {
    name: "estado",
    comment: "0 visible, 1 oculto",
    default: () => "'b'0''",
  })
  estado: boolean;

  @Column("datetime", {
    name: "fecha_creacion",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date;

  @Column("int", { name: "usuario_creacion" })
  usuarioCreacion: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.comentariosPerfilJugadors, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "perfil_comentado_jugador_id", referencedColumnName: "usuarioId" },
  ])
  perfilComentadoJugador: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.comentariosPerfilJugadors2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "autor_comentario_id", referencedColumnName: "usuarioId" },
  ])
  autorComentario: Usuario;
}
