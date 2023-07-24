import axios from 'axios';
import { expect } from 'chai';
import { cleanAll } from './clear';
import { createJwtToken } from './createJwtToken';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { createFakerUser } from '../seeds/factory';

describe('Graphql - Query Users ', async () => {
  let userDb: User[];
  let token: string;
  let user: User[];
  let count: number;
  const validSkip = 0;
  const validLimit = 10;

  afterEach(async () => {
    await cleanAll();
  });

  beforeEach(async () => {
    userDb = await createFakerUser(50);
    token = createJwtToken({ payload: { userId: userDb[0].id } });
    [user, count] = await AppDataSource.manager.findAndCount(User, { order: { name: 'ASC' } });
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
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.count).to.be.eq(count);
    expect(userData.hasAfter).to.be.true;
    expect(userData.hasBefore).to.be.false;

    expect(userData.users[0].id).to.be.eq(user[0].id);
    expect(userData.users[0].name).to.be.eq(user[0].name);
    expect(userData.users[0].email).to.be.eq(user[0].email);
    expect(userData.users[0].birthDate).to.be.eq(user[0].birthDate);
  });

  it('should return all users if limit is equal to the number of users in database', async () => {
    const variables = {
      input: {
        skip: validSkip,
        limit: count,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.count).to.be.eq(count);
    expect(userData.hasBefore).to.be.false;
    expect(userData.hasAfter).to.be.false;

    expect(userData.users[0].id).to.be.eq(user[0].id);
    expect(userData.users[0].name).to.be.eq(user[0].name);
    expect(userData.users[0].email).to.be.eq(user[0].email);
    expect(userData.users[0].birthDate).to.be.eq(user[0].birthDate);
  });

  it('should return [] if skip is equal to the number of users in database', async () => {
    const variables = {
      input: {
        skip: count,
        limit: validLimit,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.count).to.be.eq(count);
    expect(userData.hasBefore).to.be.true;
    expect(userData.users).to.be.deep.eq([]);
    expect(userData.hasAfter).to.be.false;
  });

  it('should return the default values if skip and limit are null', async () => {
    const variables = {
      input: {
        skip: 0,
        limit: null,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.count).to.be.eq(count);
    expect(userData.hasBefore).to.be.false;
    expect(userData.hasAfter).to.be.true;

    expect(userData.users[0].id).to.be.eq(user[0].id);
    expect(userData.users[0].name).to.be.eq(user[0].name);
    expect(userData.users[0].email).to.be.eq(user[0].email);
    expect(userData.users[0].birthDate).to.be.eq(user[0].birthDate);
  });

  it('should return all users if limit is greater than the total number of users', async () => {
    const variables = {
      input: {
        skip: 0,
        limit: count + 5,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.count).to.be.eq(count);
    expect(userData.hasBefore).to.be.false;
    expect(userData.hasAfter).to.be.false;

    expect(userData.users[0].id).to.be.eq(user[0].id);
    expect(userData.users[0].name).to.be.eq(user[0].name);
    expect(userData.users[0].email).to.be.eq(user[0].email);
    expect(userData.users[0].birthDate).to.be.eq(user[0].birthDate);
  });

  it('should return [] if skip is greater than the total number of users', async () => {
    const variables = {
      input: {
        skip: count + 5,
        limit: validLimit,
      },
    };

    const response = await axios.post(
      'http://localhost:4000/',
      { query, variables },
      { headers: { Authorization: token } },
    );

    const userData = response.data.data.users;

    expect(userData.count).to.be.eq(count);
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