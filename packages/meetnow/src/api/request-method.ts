import { Method } from 'axios';

export const RequestMethod: {
  [key: string]: Method;
} = {
  GET  : 'get',
  POST : 'post',
};
