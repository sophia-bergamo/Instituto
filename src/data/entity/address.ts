import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { Field, Int, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Address {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column()
  @Field()
  cep!: string;

  @Column()
  @Field()
  street!: string;

  @Column()
  @Field((type) => Int)
  streetNumber!: number;

  @Column()
  @Field()
  complement!: string;

  @Column()
  @Field()
  neighborhood!: string;

  @Column()
  @Field()
  city!: string;

  @Column()
  @Field()
  state!: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user!: User;
}
