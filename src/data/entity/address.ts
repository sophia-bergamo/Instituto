import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cep!: string;

  @Column()
  street!: string;

  @Column()
  streetNumber!: number;

  @Column()
  complement!: string;

  @Column()
  neighborhood!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user!: User;
}
