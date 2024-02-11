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
  React.ComponentProps<typeof Toast.Root> & ToastStyledProps
>(({ $variant }) => toast({ variant: $variant }));

export const Title = tw(Toast.Title)<
  React.ComponentProps<typeof Toast.Title> & ToastStyledProps
>(({ $variant }) => toastTitle({ variant: $variant }));

export const Description = tw(Toast.Description)<
  React.ComponentProps<typeof Toast.Description> & ToastStyledProps
>(({ $variant }) => toastDescription({ variant: $variant }));

export const Action = tw(Toast.Action)<
  React.ComponentProps<typeof Toast.Action> & ToastStyledProps
>(({ $variant }) => toastAction({ variant: $variant }));

export const Close = tw(Toast.Close)<
  React.ComponentProps<typeof Toast.Close> & ToastStyledProps
>(({ $variant }) => toastClose({ variant: $variant }));
