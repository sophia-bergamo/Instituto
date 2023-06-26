import axios from 'axios';
import { expect } from 'chai';
import chai = require('chai');
import { initialize } from '../initialize';

describe('Teste', () => {
  before(async () => {
    await initialize();
  });
  it('Hello, world!', async () => {
    const response = await axios.post('http://localhost:3000/', {
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
