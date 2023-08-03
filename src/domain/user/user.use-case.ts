import { UsersDataSource } from '../../data/users/users.data-source';
import { NotFoundError } from '../../test/error';

export interface UserInput {
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

export class UserUseCase {
  public async exec(input: UserInput): Promise<UserModel> {
    const userDs = new UsersDataSource();
    const userId = await userDs.findUserById(input);

    if (!userId) {
      throw new NotFoundError('Id Not found');
    }

    return userId;
  }
}
