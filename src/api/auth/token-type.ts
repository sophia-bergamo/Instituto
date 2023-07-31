import 'reflect-metadata';
import { Field, Int, ObjectType } from 'type-graphql';

export
@ObjectType()
class ServerContext {
  @Field({ nullable: true })
  token?: string;
}

export
@ObjectType()
class TokenData {
  @Field((type) => Int)
  userId!: number;
}
