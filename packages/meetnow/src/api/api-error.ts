export interface ErroMsg {
  msg: string;
  errorCode: number;
}

const DEFAULT_ERROR: ErroMsg = {
  msg       : 'Unknown Error',
  errorCode : -1,
};

export class ApiError extends Error {
  bizCode: number;
  errCode: number;

  constructor(bizCode: number, error: ErroMsg = DEFAULT_ERROR) {
    super();
    this.name = 'ApiError';
    this.message = error.msg;
    this.errCode = error.errorCode;
    this.bizCode = bizCode;
  }
}

// TODO
// api error type checker
