import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { HistorialTrabajoCoach } from "./HistorialTrabajoCoach";
import { Usuario } from "./Usuario";
import { Ficheros } from "./Ficheros";

@Index("FK_informacion_personoal_coach_usuario", ["coachId"], {})
@Index("FK_informacion_personal_coach_ficheros", ["fotoPerfilId"], {})
@Entity("informacion_personal_coach", { schema: "hoop-link" })
export class InformacionPersonalCoach {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "informacion_personal_coach_id",
  })
  informacionPersonalCoachId: number;

  @Column("int", { name: "coach_id", default: () => "'0'" })
  coachId: number;

  @Column("int", { name: "foto_perfil_id", nullable: true })
  fotoPerfilId: number | null;

  @Column("varchar", {
    name: "trabajo_actual",
    length: 100,
    default: () => "'0'",
  })
  trabajoActual: string;

  @Column("varchar", {
    name: "personalidad",
    length: 250,
    default: () => "'0'",
  })
  personalidad: string;

  @Column("varchar", { name: "valores", length: 250, default: () => "'0'" })
  valores: string;

  @Column("varchar", { name: "objetivos", length: 250, default: () => "'0'" })
  objetivos: string;

  @Column("int", { name: "antiguedad", default: () => "'0'" })
  antiguedad: number;

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

  @Column("datetime", {
    name: "fechaEdicion",
    nullable: true,
    default: () => "'0'",
  })
  fechaEdicion: Date | null;

  @Column("int", { name: "usuarioEdicion", nullable: true })
  usuarioEdicion: number | null;

  @OneToMany(
    () => HistorialTrabajoCoach,
    (historialTrabajoCoach) => historialTrabajoCoach.informacionPersonalCoach
  )
  historialTrabajoCoaches: HistorialTrabajoCoach[];

  @ManyToOne(() => Usuario, (usuario) => usuario.informacionPersonalCoaches, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "coach_id", referencedColumnName: "usuarioId" }])
  coach: Usuario;

  @ManyToOne(
    () => Ficheros,
    (ficheros) => ficheros.informacionPersonalCoaches,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "foto_perfil_id", referencedColumnName: "ficheroId" }])
  fotoPerfil: Ficheros;
}
