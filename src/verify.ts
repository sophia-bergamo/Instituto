import Jwt from 'jsonwebtoken';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { UnauthorizedError } from './test/error';

//função que verifica se dentro do token existe realmente o id que o usuário mandou
export async function verifyJWT(token: string) {
  try {
    const payload = Jwt.verify(token, process.env.JWT_TOKEN!) as Jwt.JwtPayload;
    await AppDataSource.manager.findOneOrFail(User, { where: { id: payload.userId } });
  } catch (error) {
    throw new UnauthorizedError('Credenciais inválidas');
  }
}
