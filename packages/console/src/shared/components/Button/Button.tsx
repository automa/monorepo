import React from 'react';

import { CommonWrapper } from 'theme';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

const Button = CommonWrapper<ButtonComponentProps>(
  ({
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    color,
    children,
    ...props
  }) => {
    return (
      <Container
        type="button"
        $variant={variant}
        $size={size}
        $disabled={disabled}
        disabled={disabled}
        $fullWidth={fullWidth}
        $color={color}
        {...props}
      >
        {children}
      </Container>
    );
  },
);

export default Button;
