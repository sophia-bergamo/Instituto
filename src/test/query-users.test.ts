import axios from 'axios';
import { expect } from 'chai';
import { cleanAll } from './clear';
import { createJwtToken } from './createJwtToken';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { createFakerUsers } from '../seeds/factory';
import { isDefined } from './is-defined';
import { PaginatedUsers } from '../schema';

describe('Graphql - Query Users ', async () => {
  let usersDb: User[];
  let token: string;
  let users: User[];
  let totalOfUsers: number;
  const validSkip = 0;
  const validLimit = 10;

  afterEach(async () => {
    await cleanAll();
  });

  beforeEach(async () => {
    usersDb = await createFakerUsers(50);
    token = createJwtToken({ payload: { userId: usersDb[0].id } });
    [users, totalOfUsers] = await AppDataSource.manager.findAndCount(User, { order: { name: 'ASC' } });
  });

  const query = `
  query Users($input: UsersInput) {
    users(input: $input) {
      totalOfUsers
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

  it('should return users from 1 to 10 using default inputs', async () => {
    const variables = {
      input: {
        skip: validSkip,
        limit: validLimit,
      },
    };

    const response = await axios.post<{ data: { users: PaginatedUsers } }>(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.totalOfUsers).to.be.eq(totalOfUsers);
    expect(userData.hasAfter).to.be.true;
    expect(userData.hasBefore).to.be.false;

    for (const userResponse of userData.users) {
      const userDb = users.find(({ id }) => id === userResponse.id);

      isDefined(userDb);
      expect(userResponse.name).to.be.eq(userDb.name);
      expect(userResponse.email).to.be.eq(userDb.email);
      expect(userResponse.birthDate).to.be.eq(userDb.birthDate);
    }
  });

  it('should have a skip greater than limit', async () => {
    const variables = {
      input: {
        skip: 10,
        limit: 5,
      },
    };

    const response = await axios.post<{ data: { users: PaginatedUsers } }>(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    for (const userResponse of userData.users) {
      const userDb = users.find(({ id }) => id === userResponse.id);

      isDefined(userDb);
      expect(userResponse.name).to.be.eq(userDb.name);
      expect(userResponse.email).to.be.eq(userDb.email);
      expect(userResponse.birthDate).to.be.eq(userDb.birthDate);
    }
  });

  it('should return all users if limit is equal to the number of users in database', async () => {
    const variables = {
      input: {
        skip: validSkip,
        limit: totalOfUsers,
      },
    };

    const response = await axios.post<{ data: { users: PaginatedUsers } }>(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    for (const userResponse of userData.users) {
      const userDb = users.find(({ id }) => id === userResponse.id);

      isDefined(userDb);
      expect(userResponse.name).to.be.eq(userDb.name);
      expect(userResponse.email).to.be.eq(userDb.email);
      expect(userResponse.birthDate).to.be.eq(userDb.birthDate);
    }
  });

  it('should return an empty array if skip is equal to the number of users in database', async () => {
    const variables = {
      input: {
        skip: totalOfUsers,
        limit: validLimit,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.totalOfUsers).to.be.eq(totalOfUsers);
    expect(userData.hasBefore).to.be.true;
    expect(userData.users).to.be.deep.eq([]);
    expect(userData.hasAfter).to.be.false;
  });

  it('should return the default values if skip and limit are null', async () => {
    const variables = {
      input: {
        skip: null,
        limit: null,
      },
    };

    const response = await axios.post<{ data: { users: PaginatedUsers } }>(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    for (const userResponse of userData.users) {
      const userDb = users.find(({ id }) => id === userResponse.id);

      isDefined(userDb);
      expect(userResponse.name).to.be.eq(userDb.name);
      expect(userResponse.email).to.be.eq(userDb.email);
      expect(userResponse.birthDate).to.be.eq(userDb.birthDate);
    }
  });

  it('should return all users if limit is greater than the total number of users', async () => {
    const variables = {
      input: {
        skip: 0,
        limit: totalOfUsers + 5,
      },
    };

    const response = await axios.post<{ data: { users: PaginatedUsers } }>(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    for (const userResponse of userData.users) {
      const userDb = users.find(({ id }) => id === userResponse.id);

      isDefined(userDb);
      expect(userResponse.name).to.be.eq(userDb.name);
      expect(userResponse.email).to.be.eq(userDb.email);
      expect(userResponse.birthDate).to.be.eq(userDb.birthDate);
    }
  });

  it('should return an empty array if skip is greater than the total number of users', async () => {
    const variables = {
      input: {
        skip: totalOfUsers + 5,
        limit: validLimit,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.totalOfUsers).to.be.eq(totalOfUsers);
    expect(userData.hasBefore).to.be.true;
    expect(userData.hasAfter).to.be.false;
    expect(userData.users).to.be.deep.eq([]);
  });

  it('should throw error if limit is 0', async () => {
    const variables = {
      input: {
        skip: validSkip,
        limit: 0,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Limit não pode ser zero');
    expect(error.code).to.be.eq(400);
    expect(response.data.data).to.be.eq(null);
  });

  it('should throw error if user is not authenticated', async () => {
    const variables = { input: {} };

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
      { query, variables },
      { headers: { Authorization: token } },
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
      { query, variables },
      { headers: { Authorization: token } },
    );

    expect(response.data.errors).to.have.lengthOf(1);
    const error = response.data.errors[0];
    expect(error.message).to.be.eq('Limit não pode ser negativo');
    expect(error.code).to.be.eq(400);
  });
});
