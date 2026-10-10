import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Meme {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column()
    path: string;

    @Column()
    uses: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
