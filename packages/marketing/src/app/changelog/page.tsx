import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

import { Flex } from 'components';

import { listChangelogs } from './utils';

import Changelog from './Changelog';

import { Container, Content, Header, Timestamp } from './page.styles';

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
      <Content>
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
      </Content>
    </Container>
  );
};

export default ChangelogPage;
