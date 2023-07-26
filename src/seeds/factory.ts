import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

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

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    saveUser.push(user);
  }

  return AppDataSource.manager.save(saveUser);
};
