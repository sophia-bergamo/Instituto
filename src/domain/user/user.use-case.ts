import { AppDataSource } from '../../data/data-source';
import { User } from '../../data/entity/user';
import { UserInput } from '../../api/schema';
import { NotFoundError } from '../../test/error';

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
