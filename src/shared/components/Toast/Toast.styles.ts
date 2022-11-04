import styled from 'styled-components/macro';
import * as Toast from '@radix-ui/react-toast';

import { ToastStyledProps } from './types';

export const TitleContainer = styled(Toast.Title)<ToastStyledProps>`
  ${({ theme, $variant }) => theme.toasts[$variant].title()}
`;

export const DescriptionContainer = styled(Toast.Description)<ToastStyledProps>`
  ${({ theme, $variant }) => theme.toasts[$variant].description()}
`;

export const ActionContainer = styled(Toast.Action)<ToastStyledProps>`
  ${({ theme, $variant }) => theme.toasts[$variant].action()}
`;

export const CloseContainer = styled(Toast.Close)<ToastStyledProps>`
  ${({ theme, $variant }) => theme.toasts[$variant].close()}
`;

export const Container = styled.div<ToastStyledProps>`
  ${({ theme, $variant }) => theme.toasts[$variant].root()}

  border-radius: ${({ theme }) => theme.spacing(0.5)}px;
  padding: ${({ theme }) => theme.spacing(0.75)}px;

  max-width: ${({ theme }) => theme.breakpoints.mobile}px;
  list-style: none;
`;
