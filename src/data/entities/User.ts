import { Entity, CreateDateColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryColumn()
    id: number

    @Column({ name: 'first_name', nullable: true })
    firstName?: string

    @Column({ name: 'last_name', nullable: true })
    lastName?: string

    @Column({ type: 'date', nullable: true })
    birthday?: Date | null;

    @Column()
    cancels: Number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
