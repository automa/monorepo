import React from 'react';
import { VariantProps } from 'class-variance-authority';
import * as Toast from '@radix-ui/react-toast';

import { $, Component, Styled } from 'theme';

import { toast } from './Toast.cva';

type ToastProps = $<
  {},
  VariantProps<typeof toast>,
  {
    type?: Toast.ToastProps['type'];
    duration?: Toast.ToastProps['duration'];
    description?: () => React.ReactNode;
    action?: {
      cta: () => React.ReactNode;
      altText: Toast.ToastActionProps['altText'];
    };
    close?: () => React.ReactNode;
    children: React.ReactNode;
  }
>;

export type ToastComponentProps = Component<ToastProps>;

export type ToastStyledProps = Styled<ToastProps>;
