import * as Dialog from '@radix-ui/react-dialog';

import { tw } from 'theme';

export const Container = tw.div``;

export const Overlay = tw(Dialog.Overlay)`fixed inset-0 bg-black/50`;

export const Content = tw(
  Dialog.Content,
)`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`;

export const Title = tw(Dialog.Title)``;

export const Description = tw(Dialog.Description)``;

export const Close = tw(Dialog.Close)``;
