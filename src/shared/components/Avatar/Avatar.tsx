import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { AvatarComponentProps } from './types';

import { Container, Image, Fallback } from './Avatar.styles';

const Avatar: React.FC<AvatarComponentProps> = ({
  size,
  src,
  alt,
  ...props
}) => {
  return (
    <Container {...props} asChild>
      <AvatarPrimitive.Root>
        {src && <Image $size={size} src={src} alt={alt} />}
        <Fallback $size={size}>{alt[0].toUpperCase()}</Fallback>
      </AvatarPrimitive.Root>
    </Container>
  );
};

export default Avatar;
