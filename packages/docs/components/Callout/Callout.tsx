import React from 'react';
import { Callout as NextraCallout } from 'nextra/components';

import { CalloutProps } from './types';

const Callout: React.FC<CalloutProps> = ({
  type = 'default',
  icon: Icon,
  children,
  ...props
}) => {
  return (
    <NextraCallout
      type={type}
      emoji={<Icon size="1.75rem" weight="light" />}
      {...props}
    >
      {children}
    </NextraCallout>
  );
};

export default Callout;
