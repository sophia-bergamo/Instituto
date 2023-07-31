import { AppDataSource } from '../../data/db/db.config';
import { User } from '../../data/entity/user';
import { NotFoundError } from '../../test/error';

interface UserInput {
  userId: number;
}

export async function userUseCase(input: UserInput) {
  const user = await AppDataSource.manager.findOne(User, {
    where: { id: input.userId },
    relations: { addresses: true },
  });
  if (!user) {
    throw new NotFoundError('Id Not found');
  }
  return user;
}
