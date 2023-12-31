import { verifyJWT } from './verify';
import { UserUseCase, UsersUseCase, CreateUserUseCase } from '../domain/user';
import { ServerContext, LoginInput, Login } from './auth';
import { UserInput, UsersInput, CreateUserInput, PaginatedUsers, UserModel } from './user';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { LoginUseCase } from '../domain/auth';
import { Service } from 'typedi';

@Service()
@Resolver()
export class UserResolver {
  constructor(
    private readonly userUseCase: UserUseCase,
    private readonly usersUseCase: UsersUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserCase: CreateUserUseCase,
  ) {}

  @Query(() => String)
  hello(): string {
    return 'Hello World';
  }

  @Query(() => UserModel)
  async user(@Arg('input') input: UserInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    const userResult = await this.userUseCase.exec(input);
    return userResult;
  }

  @Query(() => PaginatedUsers)
  async users(@Arg('input') input: UsersInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    const usersResult = await this.usersUseCase.exec(input);
    return usersResult;
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('input') input: CreateUserInput, @Ctx() ctx: ServerContext) {
    await verifyJWT(ctx.token);
    const createUserResult = await this.createUserCase.exec(input);
    return createUserResult;
  }

  @Mutation(() => Login)
  async login(@Arg('input') input: LoginInput) {
    const loginResult = await this.loginUseCase.exec(input);
    return loginResult;
  }
}
