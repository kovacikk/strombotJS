import { Entity, OneToOne, Column, JoinColumn, PrimaryColumn } from "typeorm";

import { User } from "./User";

@Entity()
export class UserCommandStats {
  @PrimaryColumn({ name: "user_id", type: "string" })
  userId: string;

  @OneToOne(() => User, (user) => user.stats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  // All callable commands:
  @Column({ type: "int", default: 0 })
  bulborb: number;

  @Column({ type: "int", default: 0 })
  cat: number;

  @Column({ type: "int", default: 0 })
  cancel: number;

  @Column({ type: "int", default: 0 })
  meme: number;

  @Column({ type: "int", default: 0 })
  daymeme: number;
}
