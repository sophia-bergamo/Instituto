import 'reflect-metadata';
import { Field, InputType, ObjectType } from 'type-graphql';
import { UserModel } from '../user';

export
@InputType()
class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  rememberMe!: boolean;
}

export
@ObjectType()
class Login {
  @Field()
  token!: string;

  @Field(() => UserModel)
  user!: UserModel;
}
