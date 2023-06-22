import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import 'bcrypt';

//GraphQl Schema
//para colocar input (input NomeInput)
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
    password: String
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
      //validação do email - busca o banco se já existe um email igual
      const storageUsers = await AppDataSource.manager.find(User, { where: { email: args.input.email } });
      console.log(storageUsers);
      if (storageUsers.length > 0) {
        throw new Error('Email já registrado');
      }
      //validação da senha
      const validPassword = args.input.password;
      if (validPassword.length < 6 || !/\d/.test(validPassword) || !/[a-zA-Z]/.test(validPassword)) {
        throw new Error('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
      }
      //criação do hash da senha
      const bcrypt = require('bcrypt');
      const hashedPassword = bcrypt.hashSync(args.input.password, 10);

      const user = new User();
      user.name = args.input.name;
      user.email = args.input.email;
      user.password = hashedPassword; //armazena o hash invés da senha
      user.birthDate = args.input.birthDate;

      console.log(user);
      return AppDataSource.manager.save(user);
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
