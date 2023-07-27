import { AppDataSource } from '../../data-source';
import { User } from '../../entity/user';
import { CreateUserInput } from '../../schema';
import { InputError } from '../../test/error';
import * as bcrypt from 'bcrypt';

export async function createUserUseCase(input: CreateUserInput) {
  //busca do email - busca no banco se já existe um email igual
  const storageUsers = await AppDataSource.manager.findOne(User, { where: { email: input.email } });
  if (storageUsers) {
    throw new InputError('Email já registrado');
  }
  //validação da senha - 6 caracteres, com 1 letra e 1 digito
  const validPassword = input.password;
  const onlyCharacters = /\d/;
  const onlyNumbers = /[a-zA-Z]/;
  if (validPassword.length < 6 || !onlyCharacters.test(validPassword) || !onlyNumbers.test(validPassword)) {
    throw new InputError('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
  }
  //criação do hash da senha
  const hashedPassword = await bcrypt.hash(input.password, 10);

  //validação do email
  const validateEmail = input.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(validateEmail)) {
    throw new InputError('Email inválido');
  }

  const user = new User();
  user.name = input.name;
  user.email = input.email;
  user.password = hashedPassword; //armazena o hash invés da senha
  user.birthDate = input.birthDate;

  return AppDataSource.manager.save(user);
}
