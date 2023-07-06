import Jwt from 'jsonwebtoken';

export function verifyJWT(token: string) {
  const decoded = Jwt.decode(token);
}
