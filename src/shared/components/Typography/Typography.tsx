import React, { useMemo } from 'react';

import { CommonWrapper } from 'theme';

import { TypographyComponentProps } from './types';

import { Container } from './Typography.styles';

const Typography = CommonWrapper<TypographyComponentProps>(
  ({
    element = 'div',
    variant = 'body1',
    color,
    ellipsis,
    wordBreak,
    whiteSpace,
    textAlign,
    textTransform,
    link,
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

        case 'link1':
        case 'link2':
        case 'link3':
          return 'a';

        default:
          return element;
      }
    }, [element, variant]);

    return (
      <Container
        as={asElement}
        $color={color}
        $variant={variant}
        $ellipsis={ellipsis}
        $wordBreak={wordBreak}
        $whiteSpace={whiteSpace}
        $textAlign={textAlign}
        $textTransform={textTransform}
        $link={link || asElement === 'a'}
        {...props}
      >
        {children}
      </Container>
    );
  },
);

export default Typography;
