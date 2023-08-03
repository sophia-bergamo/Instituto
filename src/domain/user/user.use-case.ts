import { UsersDataSource } from '../../data/users/users.data-source';
import { NotFoundError } from '../../test/error';
import { Service } from 'typedi';

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

@Service()
export class UserUseCase {
  constructor(private readonly userDataSource: UsersDataSource) {}

  async exec(input: UserInput): Promise<UserModel> {
    const userId = await this.userDataSource.findUserById(input);

    if (!userId) {
      throw new NotFoundError('Id Not found');
    }

    return userId;
  }
}
