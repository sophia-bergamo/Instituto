import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from './address';
import { Field, Int, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column()
  @Field()
  name!: string;

  @Column()
  @Field()
  email!: string;

  @Column()
  @Field()
  password!: string;

  @Column()
  @Field()
  birthDate!: string;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  @Field((type) => [Address]!)
  addresses!: Address[];
}
