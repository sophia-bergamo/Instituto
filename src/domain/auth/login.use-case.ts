import { UnauthorizedError } from '../../test/error';
import * as bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { UserModel } from '../user';
import { UsersDataSource } from '../../data/users/users.data-source';

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginModel {
  token: string;
  user: UserModel;
}

export class LoginUseCase {
  async exec(input: LoginInput): Promise<LoginModel> {
    const usersDs = new UsersDataSource();
    const user = await usersDs.findUserByEmail(input);

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    const rememberMe = input.rememberMe;
    //ternário = if else
    const expiresIn = rememberMe ? '7d' : '1d';
    const token = Jwt.sign({ userId: user.id }, process.env.JWT_TOKEN as string, { expiresIn: expiresIn });

    return { user, token };
  }
}
