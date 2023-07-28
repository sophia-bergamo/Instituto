import axios from 'axios';
import { expect } from 'chai';
import { cleanAll } from './clear';
import { createUser } from './create-user';
import { createJwtToken } from './create-jwt-token';
import { User } from '../data/entity/user';
import { checkAddress, checkUsers } from './check.test';
import { UserModel } from '../api/schema';

describe('Graphql - Query User', () => {
  let userDb: User;
  let token: string;

  afterEach(async () => {
    await cleanAll();
  });

  beforeEach(async () => {
    userDb = await createUser();
    token = createJwtToken({ payload: { userId: userDb.id }, extendedExpiration: true });
  });

  const query = `
  query User($input: UserInput!) {
    user(input: $input) {
      id
      name
      email
      birthDate
      addresses {
        id
        cep
        street
        streetNumber
        complement
        neighborhood
        city
        state
      }
    }
  }`;

  it('should return user successfully', async () => {
    const variables = {
      input: {
        userId: userDb.id,
      },
    };
    const response = await axios.post<{ data: { user: UserModel } }>(
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

    const userData = response.data.data.user;

    expect(userData.id).to.be.eq(userDb.id);
    expect(userData.birthDate).to.be.eq(userDb.birthDate);
    expect(userData.email).to.be.eq(userDb.email);
    expect(userData.name).to.be.eq(userDb.name);

    checkAddress(userData.addresses, userDb.addresses);
  });

  it('should throw error if user is not found', async () => {
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
    expect(response.data.data).to.be.eq(null);
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
    expect(response.data.data).to.be.eq(null);
  });
});
