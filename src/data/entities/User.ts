import { Entity, CreateDateColumn, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn({ type: "int" })
  id: number;

  @Column({ name: "first_name", type: "varchar", nullable: true })
  firstName?: string;

  @Column({ name: "last_name", type: "varchar", nullable: true })
  lastName?: string;

  @Column({ type: "date", nullable: true })
  birthday?: Date | null;

  @Column({ type: "int", default: 0 })
  cancels: Number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
