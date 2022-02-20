import React, { useMemo } from 'react';

import { CommonWrapper } from 'theme';

import { TypographyProps } from './types';

import { Container } from './Typography.styles';

const Typography = CommonWrapper<TypographyProps>(
  ({
    element = 'div',
    noWrap = false,
    variant = 'body1',
    color,
    wordBreak,
    textAlign,
    textTransform,
    children,
    ...props
  }) => {
    const asElement = useMemo(() => {
      switch (variant) {
        case 'title1':
          return 'h1';

        case 'title2':
          return 'h2';

        case 'title3':
          return 'h3';

        case 'title4':
          return 'h4';

        case 'title5':
          return 'h5';

        case 'title6':
          return 'h6';

        default:
          return element;
      }
    }, [element, variant]);

    return (
      <Container
        as={asElement}
        $color={color}
        $variant={variant}
        $noWrap={noWrap}
        $wordBreak={wordBreak}
        $textAlign={textAlign}
        $textTransform={textTransform}
        {...props}
      >
        {children}
      </Container>
    );
  },
);

export default Typography;
