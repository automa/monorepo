import styled, { css } from 'styled-components';

import { Styled } from 'theme';

import { TypographyProps } from './Typography';

export const Container = styled.div<Styled<TypographyProps>>`
  white-space: ${({ $noWrap }) => ($noWrap ? 'nowrap' : 'normal')};

  ${({ $variant, theme }) => !!$variant && theme.typography[$variant]()}

  ${({ $textAlign }) =>
    !!$textAlign &&
    css`
      text-align: ${$textAlign};
    `}
`;
