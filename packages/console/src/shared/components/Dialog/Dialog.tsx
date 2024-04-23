import React, { useMemo } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import Button from '../Button';
import Flex from '../Flex';
import Typography from '../Typography';

import { DialogComponentProps } from './types';

import {
  Container,
  Overlay,
  Content,
  Title,
  Description,
  Footer,
} from './Dialog.styles';

const Dialog: React.FC<DialogComponentProps> = ({
  trigger,
  title,
  description,
  children,
  open,
  setOpen,
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
            <Flex direction="column" alignItems="center" className="gap-8">
              <Flex direction="column" alignItems="center" className="gap-2">
                <Title asChild>
                  <Typography variant="title4">{title}</Typography>
                </Title>
                {description && (
                  <Description asChild>{description}</Description>
                )}
              </Flex>
              {children}
            </Flex>
          </Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </Container>
  );
};

export default Dialog;

export const DialogClose = DialogPrimitive.Close;

export const DialogFooter: React.FC<{
  cancel?: boolean;
  children: React.ReactNode;
}> = ({ cancel, children }) => {
  return (
    <Footer direction="row-reverse">
      {children}
      {cancel && (
        <DialogPrimitive.Close asChild>
          <Button variant="tertiary">Cancel</Button>
        </DialogPrimitive.Close>
      )}
    </Footer>
  );
};
