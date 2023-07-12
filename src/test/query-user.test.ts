import axios from 'axios';
import { expect } from 'chai';
import { initialize } from '../initialize';
import dotenv from 'dotenv';
import { cleanAll } from './clear';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
dotenv.config({ path: './test.env' });

describe('Teste', () => {
  before(async () => {
    await initialize();
  });
  //antes de cada teste
  afterEach(async () => {
    await cleanAll();
  });

  it.only('should return user successfully', async () => {
    //criar um user, pegar o id, criar o token pra esse id - arrange
    //mandar o id, e o token (pelas headers) - act
    //verficar se o id que ele mandou foi id que ta no banco e nao só o id e sim todos os campos - asserts

    //arrange
    const hashedPassword = await bcrypt.hash('123456soso', 10);

    const user = new User();
    user.name = faker.person.firstName();
    user.email = faker.internet.email();
    user.password = hashedPassword; //armazena o hash invés da senha
    user.birthDate = faker.date.birthdate().toDateString();

    const userDb = await AppDataSource.manager.save(user);

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
        query: `
      query User($input: UserInput!) {
        user(input: $input) {
          id
          name
          email
          birthDate
        }
      }`,
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
    expect(userDb.id).to.be.eq(userDb.id);
    expect(userData.birthDate).to.be.eq(userDb.birthDate);
    expect(userData.email).to.be.eq(userDb.email);
    expect(userData.name).to.be.eq(userDb.name);
  });

  it('should throw error if user is not found', async () => {
    const hashedPassword = await bcrypt.hash('123456soso', 10);

    const user = new User();
    user.name = faker.person.firstName();
    user.email = faker.internet.email();
    user.password = hashedPassword; //armazena o hash invés da senha
    user.birthDate = faker.date.birthdate().toDateString();

    const userDb = await AppDataSource.manager.save(user);

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
        query: `
      query User($input: UserInput!) {
        user(input: $input) {
          id
          name
          email
          birthDate
        }
      }`,
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
      query: `
      query User($input: UserInput!) {
        user(input: $input) {
          id
          name
          email
          birthDate
        }
      }`,
      variables,
    });

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];

    expect(error.message).to.be.eq(`Credenciais inválidas`);
    expect(error.code).to.be.eq(401);
    expect(response.data.data.user).to.be.eq(null);
  });
});
