import { AppDataSource } from '../db/db.config';
import { User } from '../entity/user';
import * as bcrypt from 'bcrypt';

interface LoginInput {
  email: string;
}

interface UserInput {
  userId: number;
}

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

interface UsersInput {
  limit?: number;
  skip?: number;
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

export class UsersDataSource {
  private readonly respository = AppDataSource.getRepository(User);

  async findUserByEmail(input: LoginInput): Promise<User | null> {
    return this.respository.findOne({ where: { email: input.email } });
  }

  async findUserById(input: UserInput): Promise<UserModel | null> {
    return this.respository.findOne({ where: { id: input.userId }, relations: { addresses: true } });
  }

  async createUser(input: CreateUserInput): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = new User();
    user.name = input.name;
    user.email = input.email;
    user.password = hashedPassword;
    user.birthDate = input.birthDate;

    return AppDataSource.manager.save(user);
  }

  async usersAdresses(input: UsersInput): Promise<[User[], number]> {
    return this.respository.findAndCount({
      order: { name: 'ASC' },
      relations: { addresses: true },
      take: input.limit ?? 10,
      skip: input.skip,
    });
  }
}
