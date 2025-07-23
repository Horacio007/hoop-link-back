import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { HistorialEntrenadoresInformacionPersonal } from "./HistorialEntrenadoresInformacionPersonal";
import { HistorialEquiposInformacionPersonal } from "./HistorialEquiposInformacionPersonal";
import { EstatusBusquedaJugador } from "./EstatusBusquedaJugador";
import { Ficheros } from "./Ficheros";
import { PosicionJuego } from "./PosicionJuego";
import { Usuario } from "./Usuario";
import { LogrosClaveInformacionPersonal } from "./LogrosClaveInformacionPersonal";

@Index(
  "FK_informacion_personal_estatus_busqueda_jugador",
  ["estatusBusquedaJugadorId"],
  {}
)
@Index("FK_informacion_personal_foto_perfil_ficheros", ["fotoPerfilId"], {})
@Index("FK_informacion_personal_usuario", ["usuarioId"], {})
@Index("FK_posicion_juego_dos_id", ["posicionJuegoDosId"], {})
@Index("FK_posicion_juego_uno_id", ["posicionJuegoUnoId"], {})
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

  @Column("float", { name: "altura_salto_vertical", precision: 12 })
  alturaSaltoVertical: number;

  @Column("float", { name: "distancia_salto_horizontal", precision: 12 })
  distanciaSaltoHorizontal: number;

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

  @Column("datetime", { name: "anio_empezo_a_jugar", nullable: true })
  anioEmpezoAJugar: Date | null;

  @Column("bit", { name: "mano_juego", default: () => "'0'" })
  manoJuego: boolean;

  @Column("int", { name: "posicion_juego_uno_id" })
  posicionJuegoUnoId: number;

  @Column("int", { name: "posicion_juego_dos_id" })
  posicionJuegoDosId: number;

  @Column("bit", { name: "clavas", default: () => "'0'" })
  clavas: boolean;

  @Column("int", { name: "puntos_por_juego", nullable: true })
  puntosPorJuego: number | null;

  @Column("int", { name: "asistencias_por_juego", nullable: true })
  asistenciasPorJuego: number | null;

  @Column("int", { name: "rebotes_por_juego", nullable: true })
  rebotesPorJuego: number | null;

  @Column("float", {
    name: "porcentaje_tiros_media",
    nullable: true,
    precision: 12,
  })
  porcentajeTirosMedia: number | null;

  @Column("float", {
    name: "porcentaje_tiros_tres",
    nullable: true,
    precision: 12,
  })
  porcentajeTirosTres: number | null;

  @Column("float", {
    name: "porcentaje_tiros_libres",
    nullable: true,
    precision: 12,
  })
  porcentajeTirosLibres: number | null;

  @Column("datetime", { name: "desde_cuando_juegas", nullable: true })
  desdeCuandoJuegas: Date | null;

  @Column("float", {
    name: "horas_entrenamiento_semana",
    nullable: true,
    precision: 12,
  })
  horasEntrenamientoSemana: number | null;

  @Column("float", { name: "horas_gym_semana", nullable: true, precision: 12 })
  horasGymSemana: number | null;

  @Column("bit", { name: "perteneces_club", default: () => "'0'" })
  pertenecesClub: boolean;

  @Column("varchar", { name: "nombre_club", nullable: true, length: 100 })
  nombreClub: string | null;

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

  @OneToMany(
    () => HistorialEntrenadoresInformacionPersonal,
    (historialEntrenadoresInformacionPersonal) =>
      historialEntrenadoresInformacionPersonal.informacionPersonal
  )
  historialEntrenadoresInformacionPersonals: HistorialEntrenadoresInformacionPersonal[];

  @OneToMany(
    () => HistorialEquiposInformacionPersonal,
    (historialEquiposInformacionPersonal) =>
      historialEquiposInformacionPersonal.informacionPersonal
  )
  historialEquiposInformacionPersonals: HistorialEquiposInformacionPersonal[];

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

  @ManyToOne(
    () => PosicionJuego,
    (posicionJuego) => posicionJuego.informacionPersonals,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "posicion_juego_uno_id", referencedColumnName: "posicionJuegoId" },
  ])
  posicionJuegoUno: PosicionJuego;

  @ManyToOne(
    () => PosicionJuego,
    (posicionJuego) => posicionJuego.informacionPersonals2,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "posicion_juego_dos_id", referencedColumnName: "posicionJuegoId" },
  ])
  posicionJuegoDos: PosicionJuego;

  @ManyToOne(() => Usuario, (usuario) => usuario.informacionPersonals, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "usuario_id", referencedColumnName: "usuarioId" }])
  usuario: Usuario;

  @OneToMany(
    () => LogrosClaveInformacionPersonal,
    (logrosClaveInformacionPersonal) =>
      logrosClaveInformacionPersonal.informacionPersonal
  )
  logrosClaveInformacionPersonals: LogrosClaveInformacionPersonal[];
}
