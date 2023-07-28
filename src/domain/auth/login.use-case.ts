import { AppDataSource } from '../../data/data-source';
import { User } from '../../data/entity/user';
import { LoginInput } from '../../api/schema';
import { UnauthorizedError } from '../../test/error';
import * as bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';

export async function loginUseCase(input: LoginInput) {
  //bate no banco e acha um usuário pelo email
  const user = await AppDataSource.manager.findOne(User, { where: { email: input.email } });
  if (!user) {
    throw new UnauthorizedError('Credenciais inválidas');
  }

  //compara o hash do input e o hash do user que está no banco
  const passwordMatch = await bcrypt.compare(input.password, user.password);
  if (!passwordMatch) {
    throw new UnauthorizedError('Credenciais inválidas');
  }
  const rememberMe = input.rememberMe;
  //ternário = if else
  const expiresIn = rememberMe ? '7d' : '1d';
  const token = Jwt.sign({ userId: user.id }, process.env.JWT_TOKEN as string, { expiresIn: expiresIn });

  //faz com que retorne no playground
  //retorna o usuário por completo pq está pegando direto do banco
  return { user, token };
}
