import { AppDataSource } from '../../data-source';
import { User } from '../../entity/user';
import { UserInput } from '../../schema';
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
