import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Municipio } from "./Municipio";

@Index("clave_estado", ["claveEstado"], {})
@Entity("estado", { schema: "hoop-link" })
export class Estado {
  @PrimaryGeneratedColumn({ type: "int", name: "estado_id" })
  estadoId: number;

  @Column("varchar", { name: "clave_geo", length: 10 })
  claveGeo: string;

  @Column("varchar", { name: "clave_estado", length: 10 })
  claveEstado: string;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre: string;

  @Column("varchar", { name: "abreviatura", length: 100 })
  abreviatura: string;

  @OneToMany(() => Municipio, (municipio) => municipio.claveEstado2)
  municipios: Municipio[];
}
