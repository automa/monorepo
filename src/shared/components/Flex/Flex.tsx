import React from 'react';

import { CommonWrapper } from 'theme';

import { FlexComponentProps } from './types';

import { Container } from './Flex.styles';

const Flex = CommonWrapper<FlexComponentProps>(
  ({
    direction,
    wrap,
    justifyContent,
    alignItems,
    alignContent,
    gap,
    inline,
    children,
    ...props
  }) => (
    <Container
      $direction={direction}
      $wrap={wrap}
      $justifyContent={justifyContent}
      $alignItems={alignItems}
      $alignContent={alignContent}
      $gap={gap}
      $inline={inline}
      {...props}
    >
      {children}
    </Container>
  ),
);

export default Flex;
