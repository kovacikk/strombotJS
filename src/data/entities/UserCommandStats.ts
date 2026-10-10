import { Entity, OneToOne, Column, JoinColumn, PrimaryColumn } from "typeorm"

import { User } from "./User";

@Entity()
export class UserCommandStats {

    @PrimaryColumn({ name: 'user_id' })
    userId: Number;

    @OneToOne(() => User, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id'})
    user: User

    // All callable commands:
    @Column()
    cat: Number;

    @Column()
    cancel: Number;

    @Column()
    meme: Number;
}
