import styled, { css } from 'styled-components';

import { ButtonStyledProps } from './types';

export const Container = styled.button<ButtonStyledProps>`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${({ $disabled }) =>
    !!$disabled &&
    css`
      cursor: initial;
    `}

  ${({ $fullWidth }) =>
    !!$fullWidth &&
    css`
      width: 100%;
      justify-content: center;
    `}

  color: ${({ theme, $color }) =>
    $color
      ? theme.colors[$color as keyof (typeof theme)['colors']] || $color
      : 'inherit'};

  ${({ theme, $variant }) => theme.buttons.variants[$variant]()};
  ${({ theme, $size }) => theme.buttons.sizes[$size]()};
`;
