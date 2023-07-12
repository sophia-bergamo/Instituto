//classe que estende o Error que os inputs recebem

export class InputError extends Error {
  code = 400;

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  code = 401;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  code = 404;

  constructor(message: string) {
    super(message);
  }
}
