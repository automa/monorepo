import { TwcComponentProps } from 'react-twc';
import * as Select from '@radix-ui/react-select';

import { tw } from 'theme';

import Typography from '../Typography';

import { SelectStyledProps } from './types';

export const Container = tw.div``;

export const Trigger = tw(
  Select.Trigger,
)`disabled:cursor-not-allowed disabled:opacity-50`;

export const Value = tw(Select.Value)``;

export const Content = tw(
  Select.Content,
)`relative z-50 min-w-32 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1`;

export const ScrollUpButton = tw(Select.ScrollUpButton)``;

export const ScrollDownButton = tw(Select.ScrollDownButton)``;

export const Group = tw(Select.Group)``;

export const GroupLabel = tw(Select.Label)``;

export const Separator = tw(Select.Separator)``;

export const Item = tw(Select.Item)(({ disabled }) => [
  'cursor-default select-none',
  disabled && 'pointer-events-none opacity-50',
]);

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & SelectStyledProps
>(({ $error }) => ['', $error && '']);
