import Logger from './Logger';

const genLogger = (ns) => (new Logger(ns));

export default { genLogger };
