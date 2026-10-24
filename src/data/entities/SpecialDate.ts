import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class SpecialDate {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  path: string;

  @Column({ type: "int" })
  month: number;

  @Column({ type: "int" })
  day: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
