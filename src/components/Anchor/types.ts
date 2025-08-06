import { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';

type LinkProps = ComponentProps<typeof Link>;

export interface AnchorProps extends Omit<LinkProps, 'href'> {
  href?: LinkProps['href'];
  blank?: boolean;
  disabled?: boolean;
  children: ReactNode;
}
