import { verifyJWT } from './verify';
import { UserUseCase, UsersUseCase, CreateUserUseCase } from '../domain/user';
import { ServerContext, LoginInput, Login } from './auth';
import { UserInput, UsersInput, CreateUserInput, PaginatedUsers, UserModel } from './user';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { LoginUseCase } from '../domain/auth';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello World';
  }

  @Query(() => UserModel)
  async user(@Arg('input') input: UserInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    const classUser = new UserUseCase();
    return classUser.exec(input);
  }

  @Query(() => PaginatedUsers)
  async users(@Arg('input') input: UsersInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    const classUsers = new UsersUseCase();
    return classUsers.exec(input);
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('input') input: CreateUserInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    const classCreateUser = new CreateUserUseCase();
    return classCreateUser.exec(input);
  }

  @Mutation(() => Login)
  async login(@Arg('input') input: LoginInput) {
    const classLogin = new LoginUseCase();
    return classLogin.exec(input);
  }
}
