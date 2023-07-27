import bcrypt from 'bcrypt';
import { User } from '../entity/user';
import { faker } from '@faker-js/faker';
import { AppDataSource } from '../data-source';
import { Address } from '../entity/address';

export async function createUser(password?: string) {
  const hashedPassword = await bcrypt.hash(password ?? faker.internet.password(), 10);

  const user = new User();
  user.name = faker.person.firstName();
  user.email = faker.internet.email();
  user.password = hashedPassword; //armazena o hash invés da senha
  user.birthDate = faker.date.birthdate().toDateString();

  const addresses = new Address();
  addresses.cep = faker.location.zipCode();
  addresses.city = faker.location.city();
  addresses.complement = faker.location.secondaryAddress();
  addresses.neighborhood = faker.location.county();
  addresses.state = faker.location.state();
  addresses.street = faker.location.street();
  addresses.streetNumber = Number(faker.location.buildingNumber());

  user.addresses = [addresses];

  return await AppDataSource.manager.save(user);
}
