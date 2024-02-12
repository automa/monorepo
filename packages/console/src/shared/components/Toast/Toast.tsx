import React from 'react';

import { ToastComponentProps } from './types';

import { Container, Title, Description, Action, Close } from './Toast.styles';

const Toast: React.FC<ToastComponentProps> = ({
  type,
  duration,
  variant,
  children,
  description,
  action,
  close,
}) => {
  return (
    <Container type={type} duration={duration} $variant={variant}>
      <Title $variant={variant}>{children}</Title>
      {!!description && (
        <Description $variant={variant}>{description()}</Description>
      )}
      {!!action && (
        <Action asChild $variant={variant} altText={action.altText}>
          {action.cta()}
        </Action>
      )}
      {!!close && (
        <Close asChild $variant={variant}>
          {close()}
        </Close>
      )}
    </Container>
  );
};

export default Toast;
