import { TwcComponentProps } from 'react-twc';
import * as Toast from '@radix-ui/react-toast';

import { tw } from 'theme';

import { ToastStyledProps } from './types';
import {
  toast,
  toastTitle,
  toastDescription,
  toastAction,
  toastClose,
} from './Toast.cva';

export const Container = tw(Toast.Root)<
  TwcComponentProps<typeof Toast.Root> & ToastStyledProps
>(({ $variant }) => toast({ variant: $variant }));

export const Title = tw(Toast.Title)<
  TwcComponentProps<typeof Toast.Title> & ToastStyledProps
>(({ $variant }) => toastTitle({ variant: $variant }));

export const Description = tw(Toast.Description)<
  TwcComponentProps<typeof Toast.Description> & ToastStyledProps
>(({ $variant }) => toastDescription({ variant: $variant }));

export const Action = tw(Toast.Action)<
  TwcComponentProps<typeof Toast.Action> & ToastStyledProps
>(({ $variant }) => toastAction({ variant: $variant }));

export const Close = tw(Toast.Close)<
  TwcComponentProps<typeof Toast.Close> & ToastStyledProps
>(({ $variant }) => toastClose({ variant: $variant }));
