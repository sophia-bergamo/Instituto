//erros de inputs (email já registrado, senha inválida, etc)
export class InputError extends Error {
  code = 400;

  constructor(message: string) {
    super(message);
  }
}

//credenciais corretas mas sem permissão
export class UnauthorizedError extends Error {
  code = 401;

  constructor(message: string) {
    super(message);
  }
}

//credenciais não estam no banco de dados
export class NotFoundError extends Error {
  code = 404;

  constructor(message: string) {
    super(message);
  }
}
