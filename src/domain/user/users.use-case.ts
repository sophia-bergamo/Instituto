import { UserModel } from '.';
import { AppDataSource } from '../../data/db/db.config';
import { User } from '../../data/entity/user';
import { InputError } from '../../test/error';

interface UsersInput {
  limit?: number;
  skip?: number;
}

interface PaginatedUsers {
  totalOfUsers: number;
  hasBefore: boolean;
  hasAfter: boolean;
  users: UserModel[];
}

export async function usersUseCase(input: UsersInput): Promise<PaginatedUsers> {
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

  const [users, totalOfUsers] = await AppDataSource.manager.findAndCount(User, {
    order: { name: 'ASC' },
    relations: { addresses: true },
    take,
    skip,
  });
  //order - define a ordem da lista => ascendente ou decrescente
  //take - limita o número de usuários retornados ou se for null, retorna 10 como default
  //skip - pular x números da lista

  const hasBefore = skip > 0;
  const hasAfter = skip + take < totalOfUsers;
  //lógica para saber se exitem usuários antes ou depois do que estão retornados

  return { users, totalOfUsers, hasBefore, hasAfter };
}
