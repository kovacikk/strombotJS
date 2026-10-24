import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { DayCategory } from "../../media/media_types";

@Entity()
export class DayMeme {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column({ type: "varchar", unique: true })
  path: string;

  @Column({ type: "varchar" })
  type: DayCategory;

  @Column({ type: "int", default: 0 })
  uses: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
