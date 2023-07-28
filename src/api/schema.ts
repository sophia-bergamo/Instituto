//GraphQl Schema
//para colocar input (input NomeInput)
export const typeDefs = `#graphql

  type Query{
    hello: String
    user(input: UserInput!): User!
    users(input: UsersInput): PaginatedUsers!
  }

  type Address {
    id: Int!
    cep: String!
    street: String!
    streetNumber: Int!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
  }

  type PaginatedUsers {
    users: [User!]!
    totalOfUsers: Int!
    hasBefore: Boolean!
    hasAfter: Boolean!
  }

  input UsersInput{
    limit: Int
    skip: Int
  }
  
  input UserInput{
    userId: Int!
  }

  #input obrigatório !
  type Mutation{
    createUser(input: CreateUserInput!): User!  
    login(input: LoginInput!): Login!
}
  
  input CreateUserInput{
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type Login{
    token: String!
    user: User!
  }

   type User {
    addresses: [Address]
    id: Int!
    name: String!
    email: String!
    birthDate: String!
  }

  input LoginInput {
      email: String!
      password: String!
      rememberMe: Boolean
  }
`;

//interface para conectar args com os inputs
//typescript como default é obrigatório, para ser "opcional" -> ?
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface UserInput {
  userId: number;
}

export interface ServerContext {
  token?: string;
}

export interface TokenData {
  userId: number;
}

export interface UsersInput {
  limit?: number;
  skip?: number;
}

export interface PaginatedUsers {
  users: UserModel[];
  totalOfUsers: number;
  hasBefore: boolean;
  hasAfter: boolean;
}

export interface UserModel {
  addresses: AddressesModel[];
  id: number;
  name: string;
  email: string;
  birthDate: string;
}

export interface AddressesModel {
  id: number;
  cep: string;
  street: string;
  streetNumber: number;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}