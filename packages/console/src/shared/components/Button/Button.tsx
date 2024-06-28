import React from 'react';

import Anchor from '../Anchor';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

// TODO: Add loading spinner state and use it instead of disabled state
const Button: React.FC<ButtonComponentProps> = ({
  href,
  blank,
  anchor,
  to,
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
    <Anchor
      href={href}
      blank={blank}
      anchor={anchor}
      to={to}
      link={link}
      disabled={disabled || type !== 'button'}
    >
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
