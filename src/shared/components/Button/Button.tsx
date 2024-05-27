import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

const Anchor: React.FC<ButtonComponentProps> = ({
  href,
  anchor,
  to,
  link,
  type,
  disabled,
  children,
}) => {
  if (disabled || (!href && !to) || type !== 'button') {
    return children;
  }

  if (href) {
    return (
      <a href={href} {...anchor}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} {...link}>
        {children}
      </Link>
    );
  }

  return null;
};

// TODO: Add loading spinner state and use it instead of disabled state
const Button: React.FC<ButtonComponentProps> = ({
  href,
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
      anchor={anchor}
      to={to}
      link={link}
      type={type}
      disabled={disabled}
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
