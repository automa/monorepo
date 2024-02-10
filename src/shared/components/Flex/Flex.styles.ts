import styled, { css } from 'styled-components';

import { FlexStyledProps } from './types';

export const Container = styled.div<FlexStyledProps>`
  display: ${({ $inline }) => ($inline ? 'inline-flex' : 'flex')};

  ${({ $direction }) =>
    !!$direction &&
    css`
      flex-direction: ${$direction};
    `}

  ${({ $wrap }) =>
    !!$wrap &&
    css`
      flex-wrap: ${$wrap};
    `}

  ${({ $justifyContent }) =>
    !!$justifyContent &&
    css`
      justify-content: ${$justifyContent};
    `}

  ${({ $alignItems }) =>
    !!$alignItems &&
    css`
      align-items: ${$alignItems};
    `}

  ${({ $alignContent }) =>
    !!$alignContent &&
    css`
      align-content: ${$alignContent};
    `}

  ${({ theme, $gap }) =>
    !!$gap &&
    css`
      gap: ${typeof $gap === 'number'
        ? `${theme.spacing($gap)}px`
        : `${theme.spacing($gap[0])}px ${theme.spacing($gap[1])}px`};
    `}
`;
