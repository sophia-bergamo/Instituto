import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';


//GraphQl Schema - Especifica as consultas e multações 
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

  console.log(`🚀  Server ready at: ${URL}`);