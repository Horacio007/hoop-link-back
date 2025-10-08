import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Index("FK_refresh_toknes_usuario", ["usuarioId"], {})
@Entity("refresh_tokens", { schema: "hoop-link" })
export class RefreshTokens {
  @PrimaryGeneratedColumn({ type: "int", name: "refresh_token_id" })
  refreshTokenId: number;

  @Column("int", { name: "usuario_id" })
  usuarioId: number;

  @Column("varchar", { name: "token", length: 600 })
  token: string;

  @Column("timestamp", {
    name: "expires_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  expiresAt: Date;

  @Column("tinyint", { name: "revoked", width: 1, default: () => "'0'" })
  revoked: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.refreshTokens, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "usuario_id", referencedColumnName: "usuarioId" }])
  usuario: Usuario;
}
