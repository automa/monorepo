import React from 'react';
import Link from 'next/link';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

const Anchor: React.FC<ButtonComponentProps> = ({
  href,
  link,
  type,
  disabled,
  children,
}) => {
  if (disabled || !href || type !== 'button') {
    return children;
  }

  return (
    <Link href={href} {...link}>
      {children}
    </Link>
  );
};

const Button: React.FC<ButtonComponentProps> = ({
  href,
  link,
  variant,
  size,
  fullWidth,
  type = 'button',
  disabled,
  children,
  ...props
}) => {
  return (
    <Anchor href={href} link={link} type={type} disabled={disabled}>
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
    </Anchor>
  );
};

export default Button;
