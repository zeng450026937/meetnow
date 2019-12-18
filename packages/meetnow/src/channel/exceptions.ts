
export class NotSupportedError extends Error {
  bizCode: number = 900900;
  errCode: number = 0;

  constructor(message: string) {
    super();

    this.errCode = 3;
    this.name = 'NotSupportedError';
    this.message = message;
  }
}

export class NotReadyError extends Error {
  bizCode: number = 900900;
  errCode: number = 0;

  constructor(message: string) {
    super();

    this.errCode = 4;
    this.name = 'NotReadyError';
    this.message = message;
  }
}
