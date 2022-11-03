import styled from 'styled-components/macro';

import { TooltipStyledProps } from './types';

export const Container = styled.div<TooltipStyledProps>``;

export const TriggerContainer = styled.div``;

export const ContentContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: ${({ theme }) => theme.spacing(0.5)}px;
  padding: ${({ theme }) => theme.spacing(0.75)}px;
`;

export const ArrowContainer = styled.div`
  svg {
    fill: rgba(0, 0, 0, 0.9);
  }
`;
