import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { DayType } from "../../media/dayMemes/day_meme_controller";

@Entity()
export class DayMeme {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  path: string;

  @Column({ type: "varchar" })
  type: DayType;

  @Column({ type: "int", default: 0 })
  uses: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
