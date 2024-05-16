import React from 'react';
import Link from 'next/link';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

const Button: React.FC<ButtonComponentProps> = ({
  href,
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
      {disabled ? children : <Link href={href}>{children}</Link>}
    </Container>
  );
};

export default Button;
