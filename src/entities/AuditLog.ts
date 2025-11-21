import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Index("audit_log_usuario", ["usuarioId"], {})
@Entity("audit_log", { schema: "hoop-link" })
export class AuditLog {
  @PrimaryGeneratedColumn({ type: "bigint", name: "audit_log_id" })
  auditLogId: string;

  @Column("varchar", { name: "tabla", length: 100 })
  tabla: string;

  @Column("varchar", { name: "afectado_id", length: 100 })
  afectadoId: string;

  @Column("enum", { name: "accion", enum: ["INSERT", "UPDATE", "DELETE"] })
  accion: "INSERT" | "UPDATE" | "DELETE";

  @Column("json", { name: "datos_antes" })
  datosAntes: object;

  @Column("json", { name: "datos_despues" })
  datosDespues: object;

  @Column("int", { name: "usuario_id" })
  usuarioId: number;

  @Column("varchar", { name: "ip", length: 50 })
  ip: string;

  @Column("datetime", {
    name: "fecha_creacion",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.auditLogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "usuario_id", referencedColumnName: "usuarioId" }])
  usuario: Usuario;
}
