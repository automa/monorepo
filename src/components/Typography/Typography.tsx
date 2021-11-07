import React from 'react';

import theme, { $, CssWrapper } from 'theme';

import { Container } from './Typography.styles';

type TextAlign =
  | 'inherit'
  | 'initial'
  | 'left'
  | 'center'
  | 'right'
  | 'justify';

type TypographyVariant = keyof typeof theme['typography'];

export type TypographyProps = $<
  {
    element?: React.ElementType;
    variant?: TypographyVariant;
    textAlign?: TextAlign;
    noWrap?: boolean;
  },
  {} & React.HTMLAttributes<HTMLDivElement>
>;

const Typography = CssWrapper<TypographyProps>(
  ({
    element = 'div',
    variant = 'body1',
    textAlign,
    noWrap = false,
    children,
    ...props
  }) => {
    let asElement = element;

    if (!!variant && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)) {
      asElement = variant as React.ElementType;
    }

    return (
      <Container
        as={asElement}
        $variant={variant}
        $textAlign={textAlign}
        $noWrap={noWrap}
        {...props}
      >
        {children}
      </Container>
    );
  },
);

export default Typography;
