import { UserModel } from '.';
import { UsersDataSource } from '../../data/users/users.data-source';

import { InputError } from '../../test/error';

export interface UsersInput {
  limit?: number;
  skip?: number;
}

export interface PaginatedUsers {
  totalOfUsers: number;
  hasBefore: boolean;
  hasAfter: boolean;
  users: UserModel[];
}

export class UsersUseCase {
  constructor(private readonly userDataSource: UsersDataSource) {}

  async exec(input: UsersInput): Promise<PaginatedUsers> {
    const defaultLimit = 10;
    const defautSkip = 0;
    const take = input.limit ?? defaultLimit;
    const skip = input.skip ?? defautSkip;

    if (skip < 0) {
      throw new InputError('Skip não pode ser negativo');
    }

    if (take < 0) {
      throw new InputError('Limit não pode ser negativo');
    }

    if (take === 0) {
      throw new InputError('Limit não pode ser zero');
    }

    const [users, totalOfUsers] = await this.userDataSource.usersAdresses(input);

    const hasBefore = skip > 0;
    const hasAfter = skip + take < totalOfUsers;
    //lógica para saber se exitem usuários antes ou depois do que estão retornados

    return { users, totalOfUsers, hasBefore, hasAfter };
  }
}
