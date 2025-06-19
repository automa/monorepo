import React from 'react';

import Privacy from './privacy.mdx';

import { Container } from './page.styles';

export const metadata = {
  title: 'Automa ‒ Privacy Policy',
};

const PrivacyPage: React.FC = () => {
  return (
    <Container>
      <Privacy />
    </Container>
  );
};

export default PrivacyPage;
