import { Column, Entity, OneToMany } from "typeorm";
import { InformacionPersonal } from "./InformacionPersonal";

@Entity("sexo", { schema: "hoop-link" })
export class Sexo {
  @Column("int", { primary: true, name: "sexo_id" })
  sexoId: number;

  @Column("varchar", { name: "nombre", length: 50 })
  nombre: string;

  @OneToMany(
    () => InformacionPersonal,
    (informacionPersonal) => informacionPersonal.sexo
  )
  informacionPersonals: InformacionPersonal[];
}
