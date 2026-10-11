import { Entity, OneToOne, Column, JoinColumn, PrimaryColumn } from "typeorm";

import { User } from "./User";

@Entity()
export class UserCommandStats {
  @PrimaryColumn({ name: "user_id", type: "int" })
  userId: Number;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  // All callable commands:
  @Column({ type: "int", default: 0 })
  cat: Number;

  @Column({ type: "int", default: 0 })
  cancel: Number;

  @Column({ type: "int", default: 0 })
  meme: Number;
}
