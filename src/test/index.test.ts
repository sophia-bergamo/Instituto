import axios from 'axios';
import { expect } from 'chai';
import { initialize } from '../initialize';
import dotenv from 'dotenv';
import { cleanAll } from './clear';
import { And } from 'typeorm';
dotenv.config({ path: './test.env' });

describe('Teste', () => {
  before(async () => {
    await initialize();
  });
  // //antes de cada teste
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
      userInput2: {
        userId: 111,
      },
    };
    //request para servidor de uma mutation, com o nome Mutation que recebe um input createUser
    //e no input tem os campos id, name.... e com isso a request vai pra variables onde tem o conteúdo dos inputs
    const response = await axios.post('http://localhost:4000/', {
      query: `
      query User($userInput2: IDInput!) {
        user(input: $userInput2) {
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

    console.log(result);
    expect(result.user.id).to.be.deep.eq(variables.userInput2.userId);
  });
});
