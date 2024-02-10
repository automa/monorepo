import { HTMLAttributes } from 'react';
import { CSSProperties } from 'styled-components';

import { $, Component, Styled } from 'theme';

type FlexProps = $<
  {},
  {
    direction?: CSSProperties['flexDirection'];
    wrap?: CSSProperties['flexWrap'];
    justifyContent?: CSSProperties['justifyContent'];
    alignItems?: CSSProperties['alignItems'];
    alignContent?: CSSProperties['alignContent'];
    gap?: number | [number, number];
    inline?: boolean;
  },
  HTMLAttributes<HTMLDivElement>
>;

export type FlexComponentProps = Component<FlexProps>;

export type FlexStyledProps = Styled<FlexProps>;
