import styled, { css } from 'styled-components/macro';
import { ellipsis } from 'polished';

import { TypographyStyledProps } from './types';

export const Container = styled.div<TypographyStyledProps>`
  color: ${({ theme, $color }) =>
    !!$color
      ? theme.colors[$color as keyof typeof theme['colors']] || $color
      : 'inherit'};

  ${({ theme, $variant }) => theme.typography[$variant]()}

  white-space: ${({ $noWrap }) => ($noWrap ? 'nowrap' : 'normal')};

  ${({ $ellipsis }) =>
    !!$ellipsis &&
    !!Object.keys($ellipsis).length &&
    css`
      ${ellipsis($ellipsis.width, $ellipsis.lines)}
    `}

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
