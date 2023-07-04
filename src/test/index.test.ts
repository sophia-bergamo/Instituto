import axios from 'axios';
import { expect } from 'chai';
import { initialize } from '../initialize';
import dotenv from 'dotenv';
import { cleanAll } from './clear';
dotenv.config({ path: './test.env' });

describe('Teste', () => {
  before(async () => {
    await initialize();
  });
  //antes de cada teste
  beforeEach(async () => {
    await cleanAll();
  });
  //depois de todos os testes
  after(async () => {
    cleanAll();
  });

  it('Teste', async () => {
    //igual ao playground
    const variables = {
      input: {
        birthDate: '01-01-2002',
        email: 'instituto@gmail.com',
        name: 'instituto',
        password: 'aa12456',
      },
    };
    //request para servidor de uma mutation, com o nome Mutation que recebe um input createUser
    //e no input tem os campos id, name.... e com isso a request vai pra variables onde tem o conteúdo dos inputs
    const response = await axios.post('http://localhost:4000/', {
      query: `
      mutation Mutation($input: CreateUserInput!) { 
        createUser(input: $input){ 
          id
          name
          email
          birthDate
        } 
      }`,
      variables,
    });
    //um data do axios e outro do Apollo
    const result = response.data.data;

    expect(result.createUser.name).to.be.eq(variables.input.name);
    expect(result.createUser.email).to.be.eq(variables.input.email);
    expect(result.createUser.birthDate).to.be.eq(variables.input.birthDate);
  });
});
