import React from 'react';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

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
