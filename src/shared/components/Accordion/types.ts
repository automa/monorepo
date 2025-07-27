import { HTMLAttributes, ReactNode } from 'react';
import * as Accordion from '@radix-ui/react-accordion';

import { $, Component, Styled } from 'theme';

type AccordionPrimitiveProps =
  | Accordion.AccordionSingleProps
  | Accordion.AccordionMultipleProps;

type AccordionProps = $<
  {},
  {},
  {
    type?: AccordionPrimitiveProps['type'];
    collapsible?: boolean;
    defaultValue?: AccordionPrimitiveProps['defaultValue'];
    orientation?: AccordionPrimitiveProps['orientation'];
    disabled?: AccordionPrimitiveProps['disabled'];
    onValueChange?: AccordionPrimitiveProps['onValueChange'];
  } & Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'>
>;

export type AccordionComponentProps = Component<AccordionProps>;

export type AccordionStyledProps = Styled<AccordionProps>;

type AccordionItemProps = $<
  {},
  {},
  {
    value: Accordion.AccordionItemProps['value'];
    disabled?: Accordion.AccordionItemProps['disabled'];
    trigger: ReactNode;
  } & HTMLAttributes<HTMLDivElement>
>;

export type AccordionItemComponentProps = Component<AccordionItemProps>;

export type AccordionItemStyledProps = Styled<AccordionItemProps>;
