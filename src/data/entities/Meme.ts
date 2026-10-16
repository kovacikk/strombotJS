import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Meme {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  path: string;

  @Column({ type: "int", default: 0 })
  uses: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
