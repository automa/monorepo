import { HTMLAttributes } from 'react';
import { Callout as NextraCallout } from 'nextra/components';
import type { Icon } from '@phosphor-icons/react';

type NextraCalloutProps = Parameters<typeof NextraCallout>[0];

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  type?: NextraCalloutProps['type'];
  icon: Icon;
}
