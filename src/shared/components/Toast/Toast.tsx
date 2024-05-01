import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

import { useToast } from 'shared/hooks';

import { ToastComponentProps } from './types';

import {
  Container,
  Title,
  Description,
  Action,
  Close,
  Viewport,
} from './Toast.styles';

const Toast: React.FC<ToastComponentProps> = ({
  type,
  duration,
  variant,
  title,
  description,
  action,
  close,
}) => {
  return (
    <Container type={type} duration={duration} $variant={variant}>
      <Title $variant={variant}>{title}</Title>
      {!!description && (
        <Description $variant={variant}>{description}</Description>
      )}
      {!!action && (
        <Action asChild $variant={variant} altText={action.altText}>
          {action.cta}
        </Action>
      )}
      {!!close && (
        <Close asChild $variant={variant}>
          {close}
        </Close>
      )}
    </Container>
  );
};

export default Toast;

export const Toasts = () => {
  const { toasts } = useToast();

  return (
    <ToastPrimitive.Provider>
      {toasts.map(({ id, ...toast }) => (
        <Toast key={id} {...toast} />
      ))}
      <Viewport />
    </ToastPrimitive.Provider>
  );
};
