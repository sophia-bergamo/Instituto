import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Address } from '../entity/address';
import { User } from '../entity/user';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'sophia',
  password: '123456',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [User, Address],
  migrations: [],
  subscribers: [],
});
