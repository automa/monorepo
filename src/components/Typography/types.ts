import { ElementType, HTMLAttributes } from 'react';
import { Property } from 'csstype';

import theme, { $, Common, Styled } from 'theme';

export type TextColor = keyof typeof theme['colors'] | Property.Color;

export type TextAlign =
  | 'inherit'
  | 'initial'
  | 'left'
  | 'center'
  | 'right'
  | 'justify';

export type TextVariant = keyof typeof theme['typography'];

export type TypographyProps = $<
  {
    color?: TextColor;
    variant?: TextVariant;
    noWrap?: boolean;
  },
  {
    wordBreak?: Property.WordBreak;
    textAlign?: TextAlign;
    textTransform?: Property.TextTransform;
  },
  {
    element?: ElementType;
  } & HTMLAttributes<HTMLDivElement>
>;

export type TypographyComponentProps = Common<TypographyProps>;

export type TypographyStyledProps = Styled<TypographyProps>;
