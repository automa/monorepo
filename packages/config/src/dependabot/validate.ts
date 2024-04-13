import Ajv from 'ajv-draft-04';

import { Config } from './types';
import schema from './schema.json';

const ajv = new Ajv({
  strictTypes: false,
  keywords: ['x-intellij-enum-metadata'],
});

export const validateDependabot = (config: Config) => {
  const schemaValidate = ajv.compile(schema);

  if (!schemaValidate) {
    throw new Error('Schema not found');
  }

  const valid = schemaValidate(config);

  if (!valid) {
    return schemaValidate.errors;
  }

  return null;
};
