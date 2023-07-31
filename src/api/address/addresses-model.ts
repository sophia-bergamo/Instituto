import 'reflect-metadata';
import { Field, Int, ObjectType } from 'type-graphql';

export
@ObjectType()
class AddressesModel {
  @Field((type) => Int)
  id!: number;

  @Field()
  cep!: string;

  @Field()
  street!: string;

  @Field((type) => Int)
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
