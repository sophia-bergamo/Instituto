import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import * as bcrypt from 'bcrypt';
import { InputErrors } from './test/error';
import Jwt from 'jsonwebtoken';
import { CreateUserInput, LoginInput } from './schema';

export const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    createUser: async (_: any, args: CreateUserInput) => {
      //busca do email - busca no banco se já existe um email igual
      const storageUsers = await AppDataSource.manager.findOne(User, { where: { email: args.input.email } });
      if (storageUsers) {
        throw new InputErrors('Email já registrado');
      }
      //validação da senha - 6 caracteres, com 1 letra e 1 digito
      const validPassword = args.input.password;
      const onlyCharacters = /\d/;
      const onlyNumbers = /[a-zA-Z]/;
      if (validPassword.length < 6 || !onlyCharacters.test(validPassword) || !onlyNumbers.test(validPassword)) {
        throw new InputErrors('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
      }
      //criação do hash da senha
      const hashedPassword = await bcrypt.hash(args.input.password, 10);

      //validação do email
      const validateEmail = args.input.email;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(validateEmail)) {
        throw new InputErrors('Email inválido');
      }

      const user = new User();
      user.name = args.input.name;
      user.email = args.input.email;
      user.password = hashedPassword; //armazena o hash invés da senha
      user.birthDate = args.input.birthDate;

      return AppDataSource.manager.save(user);
    },
    login: async (_: any, args: LoginInput) => {
      //bate no banco e acha um usuário pelo email
      const user = await AppDataSource.manager.findOne(User, { where: { email: args.input.email } });
      if (!user) {
        throw new InputErrors('Usuário não encontrado');
      }

      //compara o hash do input e o hash do user que está no banco
      const passwordMatch = await bcrypt.compare(args.input.password, user.password);
      if (!passwordMatch) {
        throw new InputErrors('Senha incorreta');
      }

      const token = Jwt.sign({ userId: user.id }, 'skljaksdj9983498327453lsldkjf', { expiresIn: '1h' });

      //faz com que retorne no playground
      //retorna o usuário por completo pq está pegando direto do banco
      return { user: user, token: token };
    },
  },
};
