import React from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

import { Flex } from 'components';

import Changelog from './Changelog';

import { listChangelogs } from './utils';
import { Container, Header, Timestamp } from './page.styles';

export const metadata = {
  title: 'Automa ‒ Changelog',
  description:
    "We are perfectionists. We don't stop until we get it right. This is our changelog.",
};

const ChangelogPage: React.FC = () => {
  // TODO: Need pagination
  const changelogs = listChangelogs().slice(0, 10);

  return (
    <Container>
      <Header>Changelog</Header>
      <Flex direction="column" className="gap-12 lg:gap-20">
        {changelogs.map(({ date, path, slug }) => (
          <Flex key={slug} className="flex-wrap lg:flex-nowrap">
            <Timestamp>
              <Link href={`/changelog/${slug}`}>
                {format(new Date(date), 'MMM dd, yyyy')}
              </Link>
            </Timestamp>
            <Changelog path={path} />
          </Flex>
        ))}
      </Flex>
    </Container>
  );
};

export default ChangelogPage;
