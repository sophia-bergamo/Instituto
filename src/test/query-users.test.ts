import axios from 'axios';
import { expect } from 'chai';
import { cleanAll } from './clear';
import { createUser } from './create-user';
import { createJwtToken } from './createJwtToken';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

describe('Graphql - Query Users ', () => {
  let userDb: User;
  let token: string;
  const validSkip = 0;
  const validLimit = 10;

  afterEach(async () => {
    await cleanAll();
  });

  beforeEach(async () => {
    userDb = await createUser();
    token = createJwtToken({ payload: { userId: userDb.id }, extendedExpiration: true });
  });

  const query = `
  query Users($input: UsersInput) {
    users(input: $input) {
      count
      hasBefore
      users {
        id
        name
        email
        birthDate
      }
      hasAfter
    }
  }`;

  it('should return user successfully', async () => {
    const variables = {
      input: {
        skip: validSkip,
        limit: validLimit,
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

    const userData = response.data.data.users.users[0];
    expect(userData.id).to.be.eq(userDb.id);
    expect(userData.birthDate).to.be.eq(userDb.birthDate);
    expect(userData.email).to.be.eq(userDb.email);
    expect(userData.name).to.be.eq(userDb.name);

    const hasBefore = response.data.data.users.hasBefore;
    expect(hasBefore).to.be.eq(false);
    const hasAfter = response.data.data.users.hasAfter;
    expect(hasAfter).to.be.eq(false);

    const count = response.data.data.users.count;
    const countDb = await AppDataSource.manager.count(User);
    expect(count).to.be.eq(countDb);
  });

  it('should throw error if user is not authenticated', async () => {
    const variables = {
      input: {
        skip: validSkip,
        limit: validLimit,
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

  it('should throw error if skip is negative', async () => {
    const variables = {
      input: {
        skip: -1,
        limit: validLimit,
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
    expect(error.message).to.be.eq('Skip não pode ser negativo');
    expect(error.code).to.be.eq(400);
  });

  it('should return error if limit is negative', async () => {
    const variables = {
      input: {
        skip: validSkip,
        limit: -1,
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
    expect(error.message).to.be.eq('Limit não pode ser negativo');
    expect(error.code).to.be.eq(400);
  });
});
