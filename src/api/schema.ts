import { UserResolver } from './resolvers';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';

export const schema = buildSchemaSync({
  resolvers: [UserResolver],
  container: Container,
});
