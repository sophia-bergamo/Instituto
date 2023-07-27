import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Address } from './entity/Address';

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
