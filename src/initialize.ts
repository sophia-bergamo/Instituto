import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data/db/db.config';
import { unwrapResolverError } from '@apollo/server/errors';
import { ServerContext } from './api/auth';
import { schema } from './api';

//Para lidar com Promises, definir a ordem usando o await
export async function initialize() {
  await AppDataSource.initialize();

  const server = new ApolloServer({
    schema,
    formatError: (formattedError, error) => {
      const unwrapError = unwrapResolverError(error) as any;

      return { message: formattedError.message, code: unwrapError.code };
    },
  });
  const { url } = await startStandaloneServer<ServerContext>(server, {
    context: async ({ req }) => ({
      token: req.headers.authorization,
    }),
    listen: { port: 4000 },
  });

  console.log(url);
}
