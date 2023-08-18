import { To } from 'react-router-dom';

import { $, Component, Styled } from 'theme';

import { TypographyComponentProps } from 'shared/components/Typography';

export type LinkProps = $<
  {},
  {
    activeColor?: TypographyComponentProps['color'];
  },
  {
    to: To;
  } & TypographyComponentProps
>;

export type LinkComponentProps = Component<LinkProps>;

export type LinkStyledProps = Styled<LinkProps>;
