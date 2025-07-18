import React from 'react';
import Link from 'next/link';

import { AnchorProps } from './types';

const Anchor: React.FC<AnchorProps> = ({
  href,
  blank,
  link,
  disabled,
  children,
}) => {
  if (disabled || !href) {
    return children;
  }

  return (
    <Link
      href={href}
      {...{
        ...link,
        ...(blank && {
          target: '_blank',
          rel: 'noopener noreferrer',
        }),
      }}
    >
      {children}
    </Link>
  );
};

export default Anchor;
