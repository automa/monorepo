import React from 'react';

import Terms from './terms.mdx';

import { Container } from './page.styles';

export const metadata = {
  title: 'Automa ‒ Terms of Service',
};

const TermsPage: React.FC = () => {
  return (
    <Container>
      <Terms />
    </Container>
  );
};

export default TermsPage;
