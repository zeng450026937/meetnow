import { Api } from '../api';
import { Worker } from '../utils/worker';

export type Authentication = {
  readonly token?: string;

  api: Api;
  worker: Worker;

  invalid: () => Promise<void>;
};
