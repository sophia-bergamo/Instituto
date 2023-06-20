import "reflect-metadata"
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from "./data-source"
import { User2 } from './user2';

AppDataSource.initialize().then(async () => {

  const user = new User2()
  user.name = "instituto"
  user.email = "instituto@gmail.com"
  user.password = "12345"
  user.birthDate = "01-01-1990"

  await AppDataSource.manager.save(user)
})

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
