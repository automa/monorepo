import { readFileSync } from 'fs';
import { join } from 'path';

const assertDocumented = (schemaFile: string, docsFile: string) => {
  const schema = JSON.parse(
    readFileSync(
      join(__dirname, `../src/schemas/${schemaFile}.schema.json`),
      'utf8',
    ),
  );

  const docs = readFileSync(
    join(__dirname, `../../docs/pages/configuration/${docsFile}.mdx`),
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
