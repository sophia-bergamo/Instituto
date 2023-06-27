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
    createUser(input: CreateUserInput!): User
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
    createUser: async (_: any, args: CreateUserInput) => {
      //busca do email - busca no banco se já existe um email igual
      const storageUsers = await AppDataSource.manager.findOne(User, { where: { email: args.input.email } });
      if (storageUsers) {
        throw new Error('Email já registrado');
      }
      //validação da senha - 6 caracteres, com 1 letra e 1 digito
      const validPassword = args.input.password;
      const onlyCharacters = /\d/;
      const onlyNumbers = /[a-zA-Z]/;
      if (validPassword.length < 6 || !onlyCharacters.test(validPassword) || !onlyNumbers.test(validPassword)) {
        throw new Error('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
      }
      //criação do hash da senha
      const bcrypt = require('bcrypt');
      const hashedPassword = bcrypt.hash(args.input.password, 10);

      //validação do email
      const validateEmail = args.input.email;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(validateEmail)) {
        throw new Error('Email inválido');
      }

      const user = new User();
      user.name = args.input.name;
      user.email = args.input.email;
      user.password = hashedPassword; //armazena o hash invés da senha
      user.birthDate = args.input.birthDate;

      return AppDataSource.manager.save(user);
    },
  },
};

//Para lidar com Promisses, definir a ordem usando o await
export async function initialize() {
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
