import axios from 'axios';
import { expect } from 'chai';
import chai = require('chai');
import { initialize } from '../initialize';
import dotenv from 'dotenv';
dotenv.config({ path: './test.env' });

describe('Teste', () => {
  before(async () => {
    await initialize();
  });
  it('Hello, world!', async () => {
    const response = await axios.post('http://localhost:4000/', {
      query: `
        {
          hello
        }
      `,
    });
    const result = response.data.data;
    expect(result.hello).to.be.eq('Hello World');
  });
});
