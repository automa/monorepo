import React from 'react';

import Anchor from '../Anchor';

import { ButtonComponentProps } from './types';

import { Container } from './Button.styles';

// TODO: Add loading spinner state and use it instead of disabled state
const Button = React.forwardRef<HTMLButtonElement, ButtonComponentProps>(
  function Button(
    {
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
    },
    ref,
  ) {
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
          ref={ref}
          {...props}
        >
          {children}
        </Container>
      </Anchor>
    );
  },
);

export default Button;
