import "reflect-metadata"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

AppDataSource.initialize().then(async () => {

    const user = new User()
    user.firstName = "3"
    user.lastName = ""
    user.age = 20

    await AppDataSource.manager.save(user)
})

const typeDefs = `#graphql
    type Query {
    hello: String
}
`;

  const resolvers = {
    Query: {
      hello: () => "Hello World",
    },
  };

  const server = new ApolloServer({
      typeDefs,
      resolvers,
  });

    startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => console.log(url))
