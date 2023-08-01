import { verifyJWT } from './verify';
import { loginUseCase } from '../domain/auth';
import { userUseCase, usersUseCase, createUserUseCase } from '../domain/user';
import { ServerContext, LoginInput, Login } from './auth';
import { UserInput, UsersInput, CreateUserInput, PaginatedUsers, UserModel } from './user';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello World';
  }

  @Query(() => UserModel)
  async user(@Arg('input') input: UserInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    return userUseCase(input);
  }

  @Query(() => PaginatedUsers)
  async users(@Arg('input') input: UsersInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    return usersUseCase(input);
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('input') input: CreateUserInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    return createUserUseCase(input);
  }

  @Mutation(() => Login)
  async login(@Arg('input') input: LoginInput) {
    return loginUseCase(input);
  }
}
