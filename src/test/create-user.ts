import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { faker } from '@faker-js/faker';
import { AppDataSource } from '../data-source';

export async function createUser(password?: string) {
  const hashedPassword = await bcrypt.hash(password ?? faker.internet.password(), 10);

  const user = new User();
  user.name = faker.person.firstName();
  user.email = faker.internet.email();
  user.password = hashedPassword; //armazena o hash invés da senha
  user.birthDate = faker.date.birthdate().toDateString();

  return await AppDataSource.manager.save(user);
}
