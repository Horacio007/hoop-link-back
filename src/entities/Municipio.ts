import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Estado } from "./Estado";
import { Usuario } from "./Usuario";

@Index("FK_municipio_estado", ["claveEstado"], {})
@Entity("municipio", { schema: "hoop-link" })
export class Municipio {
  @PrimaryGeneratedColumn({ type: "int", name: "municipio_id" })
  municipioId: number;

  @Column("varchar", { name: "clave_estado", nullable: true, length: 10 })
  claveEstado: string | null;

  @Column("varchar", { name: "clave_geo", nullable: true, length: 10 })
  claveGeo: string | null;

  @Column("varchar", { name: "clave_municipio", nullable: true, length: 10 })
  claveMunicipio: string | null;

  @Column("varchar", { name: "nombre", nullable: true, length: 100 })
  nombre: string | null;

  @ManyToOne(() => Estado, (estado) => estado.municipios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "clave_estado", referencedColumnName: "claveEstado" }])
  claveEstado2: Estado;

  @OneToMany(() => Usuario, (usuario) => usuario.municipio)
  usuarios: Usuario[];
}
