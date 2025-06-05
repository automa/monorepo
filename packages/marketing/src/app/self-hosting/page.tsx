import React from 'react';

import { Button, Flex, Typography } from 'components';

import { Container, FreeBanner } from './page.styles';

const SelfHostingPage: React.FC = () => {
  return (
    <Container>
      <Flex direction="column" alignItems="center" className="gap-4">
        <Typography
          variant="title2"
          align="center"
          className="text-3xl md:text-4xl"
        >
          Control your code
        </Typography>
        <Typography
          variant="title6"
          align="center"
          className="text-neutral-500"
        >
          Deploy the platform and agents on your own infrastructure
        </Typography>
      </Flex>

      <FreeBanner>
        <Typography variant="large" className="font-semibold text-neutral-600">
          For individuals and teams up to 10 engineers
        </Typography>
        <Button
          variant="secondary"
          size="large"
          href="https://docs.automa.app/self-hosting"
          blank
        >
          Read the docs
        </Button>
      </FreeBanner>

      <Typography variant="title4" align="center">
        For teams of 10+ engineers
      </Typography>

      <iframe
        title="Contact us for Self-hosting"
        src="https://automa-app.notion.site/ebd/2094eabd7fe18069bfc2d2262253d98a"
        width="100%"
        height="900"
      />
    </Container>
  );
};

export default SelfHostingPage;
