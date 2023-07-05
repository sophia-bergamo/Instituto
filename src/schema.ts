//GraphQl Schema
//para colocar input (input NomeInput)
export const typeDefs = `#graphql

  type Query{
    hello: String
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
    id: ID!
    name: String!
    email: String!
    birthDate: String!
  }

  input LoginInput {
      email: String!
      password: String!
  }
`;

//interface para conectar args com os inputs
//typescript como default é obrigatório, para ser "opcional" -> ?
export interface CreateUserInput {
  input: {
    name: string;
    email: string;
    password: string;
    birthDate: string;
  };
}

export interface LoginInput {
  input: {
    email: string;
    password: string;
  };
}
