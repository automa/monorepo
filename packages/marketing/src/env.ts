import pkg from '../package.json';

export const environment = process.env.NEXT_PUBLIC_NODE_ENV || 'development';

export const isTest = environment === 'test';
export const isProduction = !isTest && environment !== 'development';

export const product = 'automa';
export const service = 'marketing';
export const version = pkg.version;
