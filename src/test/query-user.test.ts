import axios from 'axios';
import { expect } from 'chai';
import { initialize } from '../initialize';
import dotenv from 'dotenv';
import { cleanAll } from './clear';
import Jwt from 'jsonwebtoken';
import { createUser } from './create-user';
dotenv.config({ path: './test.env' });

before(async () => {
  await initialize();
});
describe('Graphql - Query User', () => {
  //antes de cada teste
  afterEach(async () => {
    await cleanAll();
  });

  const query = `
  query User($input: UserInput!) {
    user(input: $input) {
      id
      name
      email
      birthDate
    }
  }`;

  it('should return user successfully', async () => {
    //criar um user, pegar o id, criar o token pra esse id - arrange
    //mandar o id, e o token (pelas headers) - act
    //verficar se o id que ele mandou foi id que ta no banco e nao só o id e sim todos os campos - asserts

    //arrange
    const userDb = await createUser();

    const token = Jwt.sign({ userId: userDb.id }, process.env.JWT_TOKEN as string, { expiresIn: '7d' });

    //act
    const variables = {
      input: {
        userId: userDb.id,
      },
    };
    const response = await axios.post(
      'http://localhost:4000/',
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    //asserts
    const userData = response.data.data.user;
    expect(userData.id).to.be.eq(userDb.id);
    expect(userData.birthDate).to.be.eq(userDb.birthDate);
    expect(userData.email).to.be.eq(userDb.email);
    expect(userData.name).to.be.eq(userDb.name);
  });

  it('should throw error if user is not found', async () => {
    const userDb = await createUser();

    const token = Jwt.sign({ userId: userDb.id }, process.env.JWT_TOKEN as string, { expiresIn: '7d' });

    //igual ao playground
    const variables = {
      input: {
        userId: 299,
      },
    };
    const response = await axios.post(
      'http://localhost:4000/',
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Id Not found');
    expect(error.code).to.be.eq(404);
    expect(response.data.data.user).to.be.eq(null);
  });

  it('should throw error if user is not authenticated', async () => {
    const variables = {
      input: {
        userId: 299,
      },
    };

    const response = await axios.post('http://localhost:4000/', {
      query,
      variables,
    });

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];

    expect(error.message).to.be.eq(`Credenciais inválidas`);
    expect(error.code).to.be.eq(401);
    expect(response.data.data.user).to.be.eq(null);
  });
});
