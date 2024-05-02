import { ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import * as Toast from '@radix-ui/react-toast';

import { $, Component, Styled } from 'theme';

import { toast } from './Toast.cva';

type ToastProps = $<
  {},
  VariantProps<typeof toast>,
  {
    title: ReactNode;
    description?: ReactNode;
    action?: {
      cta: ReactNode;
      altText: Toast.ToastActionProps['altText'];
    };
    close?: ReactNode;
  } & Toast.ToastProps
>;

export type ToastComponentProps = Component<ToastProps>;

export type ToastStyledProps = Styled<ToastProps>;
