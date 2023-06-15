import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';


//GraphQl Schema - Especifica as consultas e multações 
const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const books = [
    {
      title: 'Harry Potter',
      author: 'J. K. Rowling',
    },
    {
      title: 'O Código da Vinci',
      author: 'Dan Brown',
    },
  ];

  const resolvers = {
    Query: {
      books: () => books,
    },
  };

  const server = new ApolloServer({
      typeDefs,
      resolvers,
  });
 

    startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => console.log(url))

  console.log(`🚀  Server ready at: ${URL}`);