import { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';

type LinkProps = ComponentProps<typeof Link>;

export interface AnchorProps {
  href?: LinkProps['href'];
  blank?: boolean;
  link?: Omit<LinkProps, 'href'>;
  disabled?: boolean;
  children: ReactNode;
}
