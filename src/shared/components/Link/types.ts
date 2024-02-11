import { To } from 'react-router-dom';

import { $, Component, Styled } from 'theme';

import { TypographyComponentProps } from 'shared/components/Typography';

type LinkProps = $<
  {},
  {},
  {
    to: To;
  } & TypographyComponentProps
>;

export type LinkComponentProps = Component<LinkProps>;

export type LinkStyledProps = Styled<LinkProps>;
