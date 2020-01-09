import { AxiosPromise } from 'axios';
import { AxiosRequestConfig } from 'axios';

export declare const isString: (val: unknown) => val is string;

declare function mpAdapter(config: AxiosRequestConfig): AxiosPromise;
export default mpAdapter;

export { }
