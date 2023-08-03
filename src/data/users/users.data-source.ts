import { LoginInput } from '../../domain/auth';
import { CreateUserInput, UserInput, UserModel, UsersInput } from '../../domain/user';
import { AppDataSource } from '../db/db.config';
import { User } from '../entity/user';
import * as bcrypt from 'bcrypt';

export class UsersDataSource {
  async findUserByEmail(input: CreateUserInput | LoginInput): Promise<User | null> {
    const user = await AppDataSource.manager.findOne(User, {
      where: { email: input.email },
    });
    return user;
  }

  async findUserById(input: UserInput): Promise<UserModel | null> {
    const user = await AppDataSource.manager.findOne(User, {
      where: { id: input.userId },
      relations: { addresses: true },
    });
    return user;
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
    const [users, totalOfUsers] = await AppDataSource.manager.findAndCount(User, {
      order: { name: 'ASC' },
      relations: { addresses: true },
      take: input.limit ?? 10,
      skip: input.skip,
    });
    return [users, totalOfUsers];
  }
}
