//classe que estende o Error que os inputs recebem

export class InputErrors extends Error {
  code = 400;

  constructor(message: string) {
    super(message);
  }
}
