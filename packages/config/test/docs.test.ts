import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const assertDocumented = (schemaFile: string, docsFile: string) => {
  const schema = JSON.parse(
    readFileSync(
      join(dirname(__dirname), `schemas/${schemaFile}.schema.json`),
      'utf8',
    ),
  );

  const docs = readFileSync(
    join(
      dirname(dirname(__dirname)),
      `marketing/src/content/docs/configuration/${docsFile}.mdx`,
    ),
    'utf8',
  );

  for (const prop in schema.properties) {
    if (
      docs.indexOf(`\n\n### ${prop}\n\n`) === -1 &&
      !docs.startsWith(`### ${prop}\n\n`)
    ) {
      throw new Error(`Property '${prop}' is not documented`);
    }
  }
};

suite('docs', () => {
  test('repository', () => {
    assertDocumented('repository', 'repository');
  });

  test('bots * repository', () => {
    assertDocumented('repository', 'bots/repository');
    assertDocumented('repository.bot', 'bots/repository');
  });
});
