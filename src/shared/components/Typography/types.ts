import { ElementType, HTMLAttributes } from 'react';
import { CSSProperties } from 'styled-components';

import theme, { $, Component, Styled } from 'theme';

type TextColor = keyof (typeof theme)['colors'] | CSSProperties['color'];

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
    wordBreak?: CSSProperties['wordBreak'];
    whiteSpace?: CSSProperties['whiteSpace'];
    textAlign?: CSSProperties['textAlign'];
    textTransform?: CSSProperties['textTransform'];
    link?: boolean;
  },
  {
    element?: ElementType;
  } & HTMLAttributes<HTMLDivElement>
>;

export type TypographyComponentProps = Component<TypographyProps>;

export type TypographyStyledProps = Styled<TypographyProps>;
