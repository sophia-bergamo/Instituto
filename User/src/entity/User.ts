import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

}
