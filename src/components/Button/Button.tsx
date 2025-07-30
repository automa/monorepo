import React from 'react';

import Anchor from '../Anchor';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

const Button: React.FC<ButtonComponentProps> = ({
  href,
  blank,
  link,
  variant,
  size,
  icon,
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
      link={link}
      disabled={disabled || type !== 'button'}
    >
      <Container
        $variant={variant}
        $size={size}
        $icon={icon}
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
