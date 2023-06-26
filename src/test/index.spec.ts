import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';
import { expect } from 'chai';
import chai = require('chai');

before(async () => {
  const typeDefs = `
      type Query {
        hello: String
      }
    `;

  const resolvers = {
    Query: {
      hello: () => 'Hello, world!',
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const url = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(url);
});

describe('Teste', () => {
  it('Hello, world!', async () => {
    const response = await axios.post('http://localhost:4000/', {
      query: `
        {
          hello
        }
      `,
    });
    const result = response.data.data;
    expect(result.hello).to.be.eq('Hello, world!');
  });
});
