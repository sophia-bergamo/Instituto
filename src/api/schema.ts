import { UserResolver } from './resolvers';
import { buildSchemaSync } from 'type-graphql';

export const schema = buildSchemaSync({
  resolvers: [UserResolver],
});
