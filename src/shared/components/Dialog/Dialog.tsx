import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { DialogComponentProps } from './types';

import {
  Container,
  Overlay,
  Content,
  Title,
  Description,
  Close,
} from './Dialog.styles';

const Dialog: React.FC<DialogComponentProps> = ({
  trigger,
  title,
  description,
  children,
  ...props
}) => {
  return (
    <Container {...props} asChild>
      <DialogPrimitive.Root modal>
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <Overlay />
          <Content>
            <Title asChild>{title}</Title>
            {description && <Description asChild>{description}</Description>}
            {children}
            <Close>Close</Close>
          </Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </Container>
  );
};

export default Dialog;
