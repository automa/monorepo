import React, { useMemo } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from '@phosphor-icons/react';

import Typography from '../Typography';

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
            <Title asChild>
              <Typography variant="title4">{title}</Typography>
            </Title>
            {description && (
              <Description asChild>
                <Typography variant="small">{description}</Typography>
              </Description>
            )}
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
