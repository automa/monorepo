import styled from 'styled-components/macro';
import * as Tooltip from '@radix-ui/react-tooltip';

import { TooltipStyledProps } from './types';

export const Container = styled.div<TooltipStyledProps>``;

export const TriggerContainer = styled.div``;

export const ContentContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.spacing(0.5)}px;
  padding: ${({ theme }) => theme.spacing(0.75)}px;
`;

export const Arrow = styled(Tooltip.Arrow)`
  fill: ${({ theme }) => theme.colors.black};
`;
