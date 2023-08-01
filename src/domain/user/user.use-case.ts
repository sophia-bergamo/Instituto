import { AppDataSource } from '../../data/db/db.config';
import { User } from '../../data/entity/user';
import { NotFoundError } from '../../test/error';

interface UserInput {
  userId: number;
}

export interface UserModel {
  addresses: AddressesModel[];
  id: number;
  name: string;
  email: string;
  birthDate: string;
}

interface AddressesModel {
  id: number;
  cep: string;
  street: string;
  streetNumber: number;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export async function userUseCase(input: UserInput): Promise<UserModel> {
  const user = await AppDataSource.manager.findOne(User, {
    where: { id: input.userId },
    relations: { addresses: true },
  });
  if (!user) {
    throw new NotFoundError('Id Not found');
  }
  return user;
}
