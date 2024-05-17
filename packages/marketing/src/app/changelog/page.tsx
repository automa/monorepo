import React from 'react';

import Changelog from './Changelog';

import { listChangelogs } from './utils';
import { Container } from './page.styles';

export const metadata = {
  title: 'Automa ‒ Changelog',
  description:
    "We are perfectionists. We don't stop until we get it right. This is our changelog.",
};

const ChangelogPage: React.FC = () => {
  // TODO: Need pagination
  const changelogs = listChangelogs();

  return (
    <Container>
      Changelog
      {changelogs.map(({ path, slug }) => (
        <div key={slug}>
          <Changelog path={path} />
        </div>
      ))}
    </Container>
  );
};

export default ChangelogPage;
