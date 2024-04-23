import * as Dialog from '@radix-ui/react-dialog';

import { tw } from 'theme';

import Flex from '../Flex';

export const Container = tw.div``;

export const Overlay = tw(
  Dialog.Overlay,
)`fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`;

export const Content = tw(
  Dialog.Content,
)`fixed left-1/2 top-1/2 z-50 bg-white p-8 rounded-lg shadow-modal w-full max-w-lg -translate-x-1/2 -translate-y-1/2 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2`;

export const Title = tw(Dialog.Title)``;

export const Description = tw(Dialog.Description)``;

export const Footer = tw(Flex)`w-full gap-4`;
