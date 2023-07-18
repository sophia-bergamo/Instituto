import Jwt from "jsonwebtoken";
import {TokenData} from "../schema";

export function createJwtToken(options: {payload: TokenData; extendedExpiration?: boolean}): string {
  const {payload, extendedExpiration} = options;

  const expiresIn = extendedExpiration ? "7d" : "1d";

  const token = Jwt.sign(payload, process.env.JWT_TOKEN as string, {expiresIn});

  return token;
}
