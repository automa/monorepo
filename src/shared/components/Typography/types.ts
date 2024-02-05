import { ElementType, HTMLAttributes } from 'react';
import { Property } from 'csstype';

import theme, { $, Component, Styled } from 'theme';

type TextColor = keyof (typeof theme)['colors'] | Property.Color;

type TextVariant = keyof (typeof theme)['typography'];

type Ellipsis = {
  lines?: number;
  width?: string | number;
};

type TypographyProps = $<
  {
    variant?: TextVariant;
  },
  {
    color?: TextColor;
    ellipsis?: Ellipsis;
    wordBreak?: Property.WordBreak;
    whiteSpace?: Property.WhiteSpace;
    textAlign?: Property.TextAlign;
    textTransform?: Property.TextTransform;
    link?: boolean;
  },
  {
    element?: ElementType;
  } & HTMLAttributes<HTMLDivElement>
>;

export type TypographyComponentProps = Component<TypographyProps>;

export type TypographyStyledProps = Styled<TypographyProps>;
