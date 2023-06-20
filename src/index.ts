import "reflect-metadata"
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql

  type Query{
    hello: String
  }

  type Mutation{
    CreateUser: User
}
   type User {
    id: ID
    name: String
    email: String
    password: String
    birthDate: String
  }
`;

  const resolvers = {
    Mutation: {
      CreateUser: () => ({
      id: "1",
      name: "instituto",
      email: "instituto@gmail.com",
      birthDate: "01-01-1990"
      })
    },
  };

  const server = new ApolloServer({
      typeDefs,
      resolvers,
  });

    startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => console.log(url))
