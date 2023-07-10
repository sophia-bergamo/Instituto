import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

//cria os usuários fakes e salva no banco
export const createFakerUser = async (quantity: number) => {
  const user = new User();
  user.name = faker.person.firstName('female');
  user.birthDate = faker.date.birthdate().toDateString();
  user.email = faker.internet.email({ firstName: user.name });
  user.password = faker.internet.password();

  if (quantity <= 0) {
    return;
  }

  await createFakerUser(quantity - 1);

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  await AppDataSource.manager.save(user);
};
