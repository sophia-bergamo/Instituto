import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data-source';
import { User } from './entity/User';

//GraphQl Schema
//para colocar input (input NomeInput)
//
const typeDefs = `#graphql

  type Query{
    hello: String
  }

  #input obrigatório !
  type Mutation{
    CreateUser(input: CreateUserInput!): User
}
  
  input CreateUserInput{
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

   type User {
    id: ID
    name: String
    email: String
    birthDate: String
  }
`;
//interface para conectar args com os inputs
//typescript como default é obrigatório, para ser "opcional" -> ?
interface CreateUserInput {
  input: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
  };
}

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    CreateUser: async (parent: unknown, args: CreateUserInput) => {
      const user = new User();
      user.name = args.input.name;
      user.email = args.input.email;
      user.password = args.input.password;
      user.birthDate = args.input.birthDate;

      return await AppDataSource.manager.save(user);
    },
  },
};

//Para lidar com Promisses, definir a ordem usando o await
async function initialize() {
  await AppDataSource.initialize();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(url);
}

initialize();
