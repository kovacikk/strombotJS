import {
  Entity,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  OneToOne,
} from "typeorm";
import { UserCommandStats } from "./UserCommandStats";

@Entity()
export class User {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @OneToOne(() => UserCommandStats, (stats) => stats.user, {
    cascade: ["insert"],
  })
  stats: UserCommandStats;

  @Column({ name: "first_name", type: "varchar", nullable: true })
  firstName?: string;

  @Column({ name: "last_name", type: "varchar", nullable: true })
  lastName?: string;

  @Column({ type: "int" })
  birthMonth?: number | null;

  @Column({ type: "int" })
  birthDay?: number | null;

  @Column({ type: "int", default: 0 })
  cancels: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
