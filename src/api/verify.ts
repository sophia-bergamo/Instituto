import Jwt from 'jsonwebtoken';
import { AppDataSource } from '../data/db/db.config';
import { User } from '../data/entity/user';
import { UnauthorizedError } from '../test/error';

//função que verifica se dentro do token existe realmente o id que o usuário mandou
export async function verifyJWT(token?: string) {
  try {
    if (!token) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    const payload = Jwt.verify(token, process.env.JWT_TOKEN!) as Jwt.JwtPayload;
    await AppDataSource.manager.findOneOrFail(User, { where: { id: payload.userId } });
  } catch (error) {
    throw new UnauthorizedError('Credenciais inválidas');
  }
}
