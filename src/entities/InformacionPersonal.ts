import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EstatusBusquedaJugador } from "./EstatusBusquedaJugador";
import { Ficheros } from "./Ficheros";
import { Usuario } from "./Usuario";

@Index("FK_informacion_personal_usuario", ["usuarioId"], {})
@Index(
  "FK_informacion_personal_estatus_busqueda_jugador",
  ["estatusBusquedaJugadorId"],
  {}
)
@Index("FK_informacion_personal_foto_perfil_ficheros", ["fotoPerfilId"], {})
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

  @Column("float", {
    name: "altura_salto_vertical",
    nullable: true,
    precision: 12,
  })
  alturaSaltoVertical: number | null;

  @Column("float", {
    name: "distancia_salto_horizontal",
    nullable: true,
    precision: 12,
  })
  distanciaSaltoHorizontal: number | null;

  @Column("float", { name: "peso_bench_press", nullable: true, precision: 12 })
  pesoBenchPress: number | null;

  @Column("float", { name: "peso_squats", nullable: true, precision: 12 })
  pesoSquats: number | null;

  @Column("float", {
    name: "peso_press_militar",
    nullable: true,
    precision: 12,
  })
  pesoPressMilitar: number | null;

  @Column("float", {
    name: "peso_repeticion_bench_press",
    nullable: true,
    precision: 12,
  })
  pesoRepeticionBenchPress: number | null;

  @Column("float", {
    name: "peso_repeticion_squats",
    nullable: true,
    precision: 12,
  })
  pesoRepeticionSquats: number | null;

  @Column("float", {
    name: "peso_repeticion_press_militar",
    nullable: true,
    precision: 12,
  })
  pesoRepeticionPressMilitar: number | null;

  @Column("float", {
    name: "tiempo_distancia_cien_mts",
    nullable: true,
    precision: 12,
  })
  tiempoDistanciaCienMts: number | null;

  @Column("float", {
    name: "tiempo_distancia_un_km",
    nullable: true,
    precision: 12,
  })
  tiempoDistanciaUnKm: number | null;

  @Column("float", {
    name: "tiempo_distancia_tres_km",
    nullable: true,
    precision: 12,
  })
  tiempoDistanciaTresKm: number | null;

  @Column("float", {
    name: "tiempo_distancia_cinco_km",
    nullable: true,
    precision: 12,
  })
  tiempoDistanciaCincoKm: number | null;

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

  @ManyToOne(() => Ficheros, (ficheros) => ficheros.informacionPersonals, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "foto_perfil_id", referencedColumnName: "ficheroId" }])
  fotoPerfil: Ficheros;

  @ManyToOne(() => Usuario, (usuario) => usuario.informacionPersonals, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "usuario_id", referencedColumnName: "usuarioId" }])
  usuario: Usuario;
}
