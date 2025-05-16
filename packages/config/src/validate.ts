import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import Ajv from 'ajv/dist/2019';

import { Config } from './types';

const ajv = new Ajv({
  schemas: readdirSync(join(dirname(__dirname), 'schemas')).map((file) =>
    JSON.parse(readFileSync(join(dirname(__dirname), 'schemas', file), 'utf8')),
  ),
});

// TODO: Handle $schema key
export const validate = (config: Config) => {
  const schemaValidate = ajv.getSchema('https://automa.app/schema.json');

  if (!schemaValidate) {
    throw new Error('Schema not found');
  }

  const valid = schemaValidate(config);

  if (!valid) {
    return schemaValidate.errors;
  }

  return null;
};
