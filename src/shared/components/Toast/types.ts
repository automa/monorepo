import React, { HTMLAttributes } from 'react';
import * as Toast from '@radix-ui/react-toast';

import theme, { $, Component, Styled } from 'theme';

export type ToastVariant = keyof typeof theme['toasts'];

export type ToastProps = $<
  {
    variant?: ToastVariant;
  },
  {},
  {
    type?: Toast.ToastProps['type'];
    duration?: Toast.ToastProps['duration'];
    title?: string;
    action?: {
      cta: () => React.ReactNode;
      altText: Toast.ToastActionProps['altText'];
    };
    close?: () => React.ReactNode;
    children: React.ReactNode;
  } & HTMLAttributes<HTMLDivElement>
>;

export type ToastComponentProps = Component<ToastProps>;

export type ToastStyledProps = Styled<ToastProps>;
