import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    birthday: Date

}
