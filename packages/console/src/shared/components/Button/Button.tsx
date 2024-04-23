import React from 'react';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

// TODO: Add loading spinner state and use it instead of disabled state
const Button: React.FC<ButtonComponentProps> = ({
  variant,
  size,
  fullWidth,
  type = 'button',
  disabled,
  children,
  ...props
}) => {
  return (
    <Container
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </Container>
  );
};

export default Button;
