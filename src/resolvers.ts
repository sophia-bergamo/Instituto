import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import * as bcrypt from 'bcrypt';
import { InputError, NotFoundError, UnauthorizedError } from './test/error';
import Jwt from 'jsonwebtoken';
import { CreateUserInput, UserInput, LoginInput, ServerContext, UsersInput } from './schema';
import { verifyJWT } from './verify';

export const resolvers = {
  Query: {
    hello: () => 'Hello World',
    user: async (_: any, args: UserInput, ctx: ServerContext) => {
      await verifyJWT(ctx.token);
      const user = await AppDataSource.manager.findOne(User, { where: { id: args.input.userId } });
      if (!user) {
        throw new NotFoundError('Id Not found');
      }
      return user;
    },
    users: async (_: any, args: UsersInput, ctx: ServerContext) => {
      await verifyJWT(ctx.token);
      const defaultLimit = 10;
      const defautSkip = 0;

      if (args.input.skip < 0) {
        throw new InputError('Skip não pode ser negativo');
      }

      if (args.input.limit < 0) {
        throw new InputError('Limit não pode ser negativo');
      }

      const [users, count] = await AppDataSource.manager.findAndCount(User, {
        order: { name: 'ASC' },
        take: args.input.limit ?? defaultLimit,
        skip: args.input.skip ?? defautSkip,
      });
      //order - define a ordem da lista => ascendente ou decrescente
      //take - limita o número de usuários retornados ou se for null, retorna 10 como default
      //skip - pular x números da lista

      const hasBefore = args.input.skip > 0;
      const hasAfter = args.input.skip + args.input.limit < count;
      //lógica para saber se exitem usuários antes ou depois do que estão retornados

      return { users, count, hasBefore, hasAfter };
    },
  },

  Mutation: {
    createUser: async (_: any, args: CreateUserInput, ctx: ServerContext) => {
      await verifyJWT(ctx.token);
      //busca do email - busca no banco se já existe um email igual
      const storageUsers = await AppDataSource.manager.findOne(User, { where: { email: args.input.email } });
      if (storageUsers) {
        throw new InputError('Email já registrado');
      }
      //validação da senha - 6 caracteres, com 1 letra e 1 digito
      const validPassword = args.input.password;
      const onlyCharacters = /\d/;
      const onlyNumbers = /[a-zA-Z]/;
      if (validPassword.length < 6 || !onlyCharacters.test(validPassword) || !onlyNumbers.test(validPassword)) {
        throw new InputError('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
      }
      //criação do hash da senha
      const hashedPassword = await bcrypt.hash(args.input.password, 10);

      //validação do email
      const validateEmail = args.input.email;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(validateEmail)) {
        throw new InputError('Email inválido');
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
        throw new UnauthorizedError('Credenciais inválidas');
      }

      //compara o hash do input e o hash do user que está no banco
      const passwordMatch = await bcrypt.compare(args.input.password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedError('Credenciais inválidas');
      }
      const rememberMe = args.input.rememberMe;
      //ternário = if else
      const expiresIn = rememberMe ? '7d' : '1d';
      const token = Jwt.sign({ userId: user.id }, process.env.JWT_TOKEN as string, { expiresIn: expiresIn });

      //faz com que retorne no playground
      //retorna o usuário por completo pq está pegando direto do banco
      return { user, token };
    },
  },
};
