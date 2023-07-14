import axios from 'axios';
import { expect } from 'chai';
import { cleanAll } from './clear';
import { createUser } from './create-user';
import { User } from '../entity/User';
import { faker } from '@faker-js/faker';
import Jwt from 'jsonwebtoken';

describe('Graphql - Mutation Login', () => {
  let userDb: User;
  const password = faker.internet.password();

  beforeEach(async () => {
    userDb = await createUser(password);
  });

  afterEach(async () => {
    await cleanAll();
  });

  const query = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        birthDate
      }
      token
    }
  }`;

  it('should return user successfully', async () => {
    const variables = {
      input: {
        email: userDb.email,
        password: password,
      },
    };

    const response = await axios.post('http://localhost:4000/', {
      query,
      variables,
    });

    const userData = response.data.data.login.user;
    expect(userData.id).to.be.eq(userDb.id);
    expect(userData.birthDate).to.be.eq(userDb.birthDate);
    expect(userData.email).to.be.eq(userDb.email);
    expect(userData.name).to.be.eq(userDb.name);
  });

  it('should throw error if email is invalid', async () => {
    const variables = {
      input: {
        email: 'teste.invalid@gmail.com',
        password: password,
      },
    };

    const response = await axios.post('http://localhost:4000/', {
      query,
      variables,
    });

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Credenciais inválidas');
    expect(error.code).to.be.eq(401);
  });

  it('should throw error if password is invalid', async () => {
    const variables = {
      input: {
        email: userDb.email,
        password: '123qw',
      },
    };

    const response = await axios.post('http://localhost:4000/', {
      query,
      variables,
    });

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Credenciais inválidas');
    expect(error.code).to.be.eq(401);
  });

  it('should increase token expiration time to 7d if rememberMe is true', async () => {
    const variables = {
      input: {
        email: userDb.email,
        password: password,
        rememberMe: true,
      },
    };

    const response = await axios.post('http://localhost:4000/', {
      query,
      variables,
    });

    const expiresIn = variables.input.rememberMe ? '7d' : '1d';
    const token = Jwt.sign({ userId: userDb.id }, process.env.JWT_TOKEN as string, { expiresIn: expiresIn });

    const userToken = response.data.data.login.token;
    expect(userToken).to.be.eq(token);
  });

  it('should reduce token expiration time to 1d if rememberMe is false', async () => {
    const variables = {
      input: {
        email: userDb.email,
        password: password,
        rememberMe: false,
      },
    };

    const response = await axios.post('http://localhost:4000/', {
      query,
      variables,
    });

    const expiresIn = variables.input.rememberMe ? '7d' : '1d';
    const token = Jwt.sign({ userId: userDb.id }, process.env.JWT_TOKEN as string, { expiresIn: expiresIn });

    const userToken = response.data.data.login.token;
    expect(userToken).to.be.eq(token);
  });
});
