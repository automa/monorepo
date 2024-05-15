import React from 'react';

import { ButtonComponentProps } from './types';

import { Container, Anchor } from './Button.styles';

const Button: React.FC<ButtonComponentProps> = ({
  href,
  anchor,
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
      <Anchor $disabled={disabled} href={href} {...anchor}>
        {children}
      </Anchor>
    </Container>
  );
};

export default Button;
