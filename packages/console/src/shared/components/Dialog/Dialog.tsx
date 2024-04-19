import React, { useMemo } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from '@phosphor-icons/react';

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
  open,
  setOpen,
  skipClose,
  ...props
}) => {
  const controlProps = useMemo(
    () =>
      open !== undefined && setOpen ? { open, onOpenChange: setOpen } : {},
    [open, setOpen],
  );

  return (
    <Container {...props} asChild>
      <DialogPrimitive.Root modal {...controlProps}>
        <DialogPrimitive.Trigger>{trigger}</DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <Overlay />
          <Content>
            <Title>{title}</Title>
            {description && <Description>{description}</Description>}
            {children}
            {!skipClose && (
              <Close>
                <X />
              </Close>
            )}
          </Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </Container>
  );
};

export default Dialog;
