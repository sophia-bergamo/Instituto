import { User } from '../data/entity/user';
import { AppDataSource } from '../data/data-source';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Address } from '../data/entity/address';

//salvando varios usuarios de uma vez utilizando um array vazio e populando ele
//fazendo com que acesse o banco uma única vez
export const createFakerUsers = async (quantity: number) => {
  const saveUser: User[] = [];

  for (let i = 0; i < quantity; i++) {
    const user = new User();
    user.name = faker.person.firstName('female');
    user.birthDate = faker.date.birthdate().toDateString();
    user.email = faker.internet.email({ firstName: user.name });
    user.password = faker.internet.password();

    const addresses = new Address();
    addresses.cep = faker.location.zipCode();
    addresses.city = faker.location.city();
    addresses.complement = faker.location.secondaryAddress();
    addresses.neighborhood = faker.location.county();
    addresses.state = faker.location.state();
    addresses.street = faker.location.street();
    addresses.streetNumber = Number(faker.location.buildingNumber());

    user.addresses = [addresses];

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    saveUser.push(user);
  }

  return AppDataSource.manager.save(saveUser);
};
