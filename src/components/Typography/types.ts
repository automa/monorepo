import { ElementType, HTMLAttributes } from 'react';
import { Property } from 'csstype';

import theme, { $, Common, Styled } from 'theme';

export type TextColor = keyof typeof theme['colors'] | Property.Color;

export type TextVariant = keyof typeof theme['typography'];

export type Ellipsis = {
  lines?: number;
  width?: string | number;
};

export type TypographyProps = $<
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

export type TypographyComponentProps = Common<TypographyProps>;

export type TypographyStyledProps = Styled<TypographyProps>;
