import React from 'react';

import { FlexComponentProps } from './types';

import { Container } from './Flex.styles';

const Flex: React.FC<FlexComponentProps> = ({
  inline,
  direction,
  wrap,
  justifyContent,
  justifyItems,
  alignContent,
  alignItems,
  children,
  ...props
}) => {
  return (
    <Container
      $inline={inline}
      $direction={direction}
      $wrap={wrap}
      $justifyContent={justifyContent}
      $justifyItems={justifyItems}
      $alignContent={alignContent}
      $alignItems={alignItems}
      {...props}
    >
      {children}
    </Container>
  );
};

export default Flex;
