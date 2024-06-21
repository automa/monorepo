import React from 'react';

import Manifesto from './manifesto.mdx';

import { Container, Title } from './page.styles';

const title = "Developers don't have to do grunt work";

export const metadata = {
  title: 'Automa ‒ Manifesto',
  description: `${title}. This is our manifesto.`,
};

const ManifestoPage: React.FC = () => {
  return (
    <Container>
      <Title>{title}</Title>
      <Manifesto />
    </Container>
  );
};

export default ManifestoPage;
