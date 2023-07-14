import Jwt from 'jsonwebtoken';

export function createJwtToken(payload: { userId: number; extendedExpiration?: boolean }): string {
  const { userId, extendedExpiration } = payload;

  const expiresIn = extendedExpiration ? '7d' : '1d';

  const token = Jwt.sign({ userId }, process.env.JWT_TOKEN as string, { expiresIn });

  return token;
}
