import styled, { css } from 'styled-components';

import { TypographyStyledProps } from './types';

export const Container = styled.div<TypographyStyledProps>`
  color: ${({ theme, $color }) =>
    theme.colors[$color as keyof typeof theme['colors']] ||
    $color ||
    'inherit'};

  ${({ theme, $variant }) => theme.typography[$variant]()}

  white-space: ${({ $noWrap }) => ($noWrap ? 'nowrap' : 'normal')};

  ${({ $wordBreak }) =>
    !!$wordBreak &&
    css`
      word-break: ${$wordBreak};
    `}

  ${({ $textAlign }) =>
    !!$textAlign &&
    css`
      text-align: ${$textAlign};
    `}

  ${({ $textTransform }) =>
    !!$textTransform &&
    css`
      text-transform: ${$textTransform};
    `}
`;
