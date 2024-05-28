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
>(({ $variant }) => [
  'transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  toast({ variant: $variant }),
]);

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

export const Viewport = tw(
  Toast.Viewport,
)`fixed top-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 gap-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-sm`;
