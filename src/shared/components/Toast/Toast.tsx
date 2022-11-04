import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

import { ToastComponentProps } from './types';

import {
  Container,
  TitleContainer,
  DescriptionContainer,
  ActionContainer,
  CloseContainer,
} from './Toast.styles';

const Toast: React.FC<ToastComponentProps> = ({
  variant = 'info',
  type = 'foreground',
  duration,
  title,
  action,
  close,
  children,
  ...props
}) => {
  return (
    <ToastPrimitive.Root asChild type={type} duration={duration}>
      <Container $variant={variant} {...props}>
        {!!title && <TitleContainer $variant={variant}>{title}</TitleContainer>}
        <DescriptionContainer $variant={variant}>
          {children}
        </DescriptionContainer>
        {!!action && (
          <ActionContainer asChild $variant={variant} altText={action.altText}>
            {action.cta()}
          </ActionContainer>
        )}
        {!!close && (
          <CloseContainer asChild $variant={variant}>
            {close()}
          </CloseContainer>
        )}
      </Container>
    </ToastPrimitive.Root>
  );
};

export default Toast;
