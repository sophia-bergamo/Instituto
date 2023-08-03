import { UsersDataSource } from '../../data/users/users.data-source';
import { InputError } from '../../test/error';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface CreateUserModel {
  id: number;
  name: string;
  email: string;
  birthDate: string;
}

export class CreateUserUseCase {
  constructor(private readonly userDataSource: UsersDataSource) {}

  async exec(input: CreateUserInput): Promise<CreateUserModel> {
    const userEmail = await this.userDataSource.findUserByEmail(input);

    if (userEmail) {
      throw new InputError('Email já registrado');
    }

    const validPassword = input.password;
    const onlyCharacters = /\d/;
    const onlyNumbers = /[a-zA-Z]/;
    if (validPassword.length < 6 || !onlyCharacters.test(validPassword) || !onlyNumbers.test(validPassword)) {
      throw new InputError('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
    }

    const validateEmail = input.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(validateEmail)) {
      throw new InputError('Email inválido');
    }

    const createUserDs = new UsersDataSource();
    const users = createUserDs.createUser(input);

    return users;
  }
}
