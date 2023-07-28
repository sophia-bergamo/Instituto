import { CreateUserInput, UserInput, LoginInput, ServerContext, UsersInput } from './schema';
import { verifyJWT } from '../utils/verify';
import { loginUseCase } from '../domain/auth';
import { userUseCase, usersUseCase, createUserUseCase } from '../domain/user';

export const resolvers = {
  Query: {
    hello: () => 'Hello World',
    user: async (_: any, args: { input: UserInput }, ctx: ServerContext) => {
      await verifyJWT(ctx.token);
      return userUseCase(args.input);
    },
    users: async (_: any, args: { input: UsersInput }, ctx: ServerContext) => {
      await verifyJWT(ctx.token);
      return usersUseCase(args.input);
    },
  },

  Mutation: {
    createUser: async (_: any, args: { input: CreateUserInput }, ctx: ServerContext) => {
      //await verifyJWT(ctx.token);
      return createUserUseCase(args.input);
    },
    login: (_: any, args: { input: LoginInput }) => {
      return loginUseCase(args.input);
    },
  },
};
