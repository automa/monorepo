import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { AvatarComponentProps } from './types';

import { Container, Fallback, Image } from './Avatar.styles';

const Avatar: React.FC<AvatarComponentProps> = ({
  variant,
  size,
  src,
  alt,
  ...props
}) => {
  return (
    <Container {...props} asChild>
      <AvatarPrimitive.Root>
        {src && <Image $variant={variant} $size={size} src={src} alt={alt} />}
        <Fallback $variant={variant} $size={size}>
          {alt[0].toUpperCase()}
        </Fallback>
      </AvatarPrimitive.Root>
    </Container>
  );
};

export default Avatar;
