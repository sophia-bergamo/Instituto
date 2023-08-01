import 'reflect-metadata';
import { Field, Int, ObjectType } from 'type-graphql';

export
@ObjectType()
class AddressesModel {
  @Field(() => Int)
  id!: number;

  @Field()
  cep!: string;

  @Field()
  street!: string;

  @Field(() => Int)
  streetNumber!: number;

  @Field()
  neighborhood!: string;

  @Field()
  city!: string;

  @Field()
  state!: string;

  @Field()
  complement!: string;
}
