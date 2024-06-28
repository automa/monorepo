import { AnchorHTMLAttributes } from 'react';
import { LinkProps } from 'react-router-dom';

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  blank?: boolean;
  anchor?: AnchorHTMLAttributes<HTMLAnchorElement>;
  to?: LinkProps['to'];
  link?: Omit<LinkProps, 'to'>;
  disabled?: boolean;
}
