import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import Typography from 'shared/components/Typography';

import { LinkStyledProps } from './types';

export const Container = styled(Link)<LinkStyledProps>`
  text-decoration: none;

  ${Typography} {
    transition: color 0.3s ease-in;

    &:hover,
    &:focus,
    &:active {
      color: ${({ theme, $activeColor }) =>
        $activeColor
          ? theme.colors[$activeColor as keyof (typeof theme)['colors']] ||
            $activeColor
          : 'inherit'};
    }
  }
`;
