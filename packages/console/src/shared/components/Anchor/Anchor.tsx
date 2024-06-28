import React from 'react';
import { Link } from 'react-router-dom';

import { AnchorProps } from './types';

const Anchor: React.FC<AnchorProps> = ({
  href,
  blank,
  anchor,
  to,
  link,
  disabled,
  children,
}) => {
  if (disabled || (!href && !to)) {
    return children;
  }

  if (href) {
    return (
      <a
        href={href}
        {...{
          ...anchor,
          ...(blank && {
            target: '_blank',
            rel: 'noopener noreferrer',
          }),
        }}
      >
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} {...link}>
        {children}
      </Link>
    );
  }

  return null;
};

export default Anchor;
