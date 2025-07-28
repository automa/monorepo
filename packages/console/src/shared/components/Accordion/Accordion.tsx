import React, { useCallback, useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { AccordionComponentProps, AccordionItemComponentProps } from './types';

import { Container, Content, Header, Item, Trigger } from './Accordion.styles';

const Accordion: React.FC<AccordionComponentProps> = ({
  type = 'multiple',
  collapsible = true,
  defaultValue,
  orientation,
  disabled,
  onValueChange,
  children,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);

  const change = useCallback(
    (value: string & string[]) => {
      if (!value) {
        setValue(defaultValue);
        // @ts-ignore
        onValueChange?.(defaultValue);
      } else {
        setValue(value);
        onValueChange?.(value);
      }
    },
    [defaultValue, setValue, onValueChange],
  );

  return (
    <Container {...props} asChild>
      <AccordionPrimitive.Root
        // @ts-ignore
        type={type as AccordionComponentProps['type']}
        collapsible={collapsible}
        defaultValue={defaultValue}
        orientation={orientation}
        disabled={disabled}
        value={value}
        onValueChange={change}
      >
        {children}
      </AccordionPrimitive.Root>
    </Container>
  );
};

export default Accordion;

export const AccordionItem: React.FC<AccordionItemComponentProps> = ({
  value,
  disabled = false,
  trigger,
  children,
}) => {
  return (
    <Item value={value} disabled={disabled}>
      <Header>
        <Trigger>{trigger}</Trigger>
      </Header>
      <Content>{children}</Content>
    </Item>
  );
};
