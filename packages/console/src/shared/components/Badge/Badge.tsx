import React from 'react';

import { BadgeComponentProps } from './types';

import { Container } from './Badge.styles';

const Badge: React.FC<BadgeComponentProps> = ({ variant, size, ...props }) => {
  return <Container $variant={variant} $size={size} {...props} />;
};

export default Badge;
