import React from 'react';

import { FlexComponentProps } from './types';

import { Container } from './Flex.styles';

const Flex: React.FC<FlexComponentProps> = ({
  element = 'div',
  inline,
  fullWidth,
  direction,
  wrap,
  justifyContent,
  justifyItems,
  alignContent,
  alignItems,
  children,
  ...props
}) => {
  const As = element;

  return (
    <Container
      asChild
      $inline={inline}
      $fullWidth={fullWidth}
      $direction={direction}
      $wrap={wrap}
      $justifyContent={justifyContent}
      $justifyItems={justifyItems}
      $alignContent={alignContent}
      $alignItems={alignItems}
      {...props}
    >
      <As>{children}</As>
    </Container>
  );
};

export default Flex;
