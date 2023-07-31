import 'reflect-metadata';
import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { AddressesModel } from '../address';

export
@InputType()
class CreateUserInput {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  birthDate!: string;
}

export
@InputType()
class UserInput {
  @Field((type) => Int)
  userId!: number;
}

export
@InputType()
class UsersInput {
  @Field({ nullable: true })
  limit!: number;

  @Field({ nullable: true })
  skip!: number;
}

export
@ObjectType()
class PaginatedUsers {
  @Field((type) => [UserModel])
  users!: UserModel[];

  @Field((type) => Int)
  totalOfUsers!: number;

  @Field()
  hasBefore!: boolean;

  @Field()
  hasAfter!: boolean;
}

export
@ObjectType()
class UserModel {
  @Field((type) => [AddressesModel])
  addresses!: AddressesModel[];

  @Field((type) => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  birthDate!: string;
}
