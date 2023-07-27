import axios from 'axios';
import { expect } from 'chai';
import chai = require('chai');
import { cleanAll } from './clear';
import { createUser } from './create-user';
import { User } from '../entity/User';
import { faker } from '@faker-js/faker';
import { AppDataSource } from '../data-source';
import { createJwtToken } from './create-jwt-token';

describe('Graphql - Mutation CreateUser', () => {
  let token: string;
  let userDb: User;
  const validPassword = '1234qwer';
  const validEmail = 'valid.email@gmail.com';

  beforeEach(async () => {
    userDb = await createUser();
    token = createJwtToken({ payload: { userId: userDb.id }, extendedExpiration: true });
  });

  //depois de cada teste
  afterEach(async () => {
    cleanAll();
  });

  const query = `
  mutation Mutation($input: CreateUserInput!) { 
    createUser(input: $input){ 
      id
      name
      email
      birthDate
    } 
  }`;

  it('should return user successfully', async () => {
    const variables = {
      input: {
        birthDate: faker.date.birthdate().toDateString(),
        email: validEmail,
        name: faker.person.firstName(),
        password: validPassword,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      {
        query,
        variables,
      },
      { headers: { Authorization: token } },
    );

    const result = response.data.data;
    const userDb = await AppDataSource.manager.findOneOrFail(User, { where: { id: result.createUser.id } });
    expect(userDb.birthDate).to.be.eq(result.createUser.birthDate);
    expect(userDb.email).to.be.eq(result.createUser.email);
    expect(userDb.name).to.be.eq(result.createUser.name);
    expect(userDb.birthDate).to.be.eq(variables.input.birthDate);
    expect(userDb.email).to.be.eq(variables.input.email);
    expect(userDb.name).to.be.eq(variables.input.name);
    //verificando se a senha do bando não é igual a plaintext
    //método de criptografia retorna token aleatório por isso não iguala os dois
    expect(userDb.password).to.not.be.eq(variables.input.password);
  });

  it('should throw error if user is not authenticated', async () => {
    const variables = {
      input: {
        birthDate: faker.date.birthdate().toDateString(),
        email: validEmail,
        name: faker.person.firstName(),
        password: validPassword,
      },
    };

    const response = await axios.post('http://localhost:4000/', {
      query,
      variables,
    });

    const error = response.data.errors[0];
    expect(error.message).to.be.eq(`Credenciais inválidas`);
    expect(error.code).to.be.eq(401);
    expect(response.data.data).to.be.eq(null);
  });

  it('should throw error if email is already registered', async () => {
    const variables = {
      input: {
        birthDate: faker.date.birthdate().toDateString(),
        email: userDb.email,
        name: faker.internet.email(),
        password: validPassword,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Email já registrado');
    expect(error.code).to.be.eq(400);
  });

  it('should throw error if the password has only numbers', async () => {
    const variables = {
      input: {
        birthDate: faker.date.birthdate().toDateString(),
        email: validEmail,
        name: faker.person.firstName(),
        password: '123456',
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
    expect(error.code).to.be.eq(400);
  });

  it('should throw error if the password has only letters', async () => {
    const variables = {
      input: {
        birthDate: faker.date.birthdate().toDateString(),
        email: validEmail,
        name: faker.person.firstName(),
        password: 'password',
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
    expect(error.code).to.be.eq(400);
  });

  it('should throw error if the password is too short', async () => {
    const variables = {
      input: {
        birthDate: faker.date.birthdate().toDateString(),
        email: validEmail,
        name: faker.person.firstName(),
        password: '123q',
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Senha inválida, deve conter ao menos 6 caracteres, 1 letra e um dígito');
    expect(error.code).to.be.eq(400);
  });

  it('should throw error if the email is invalid', async () => {
    const variables = {
      input: {
        birthDate: faker.date.birthdate().toDateString(),
        email: 'invalid.email',
        name: faker.person.firstName(),
        password: validPassword,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Email inválido');
    expect(error.code).to.be.eq(400);
  });
});
