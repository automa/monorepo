import React from 'react';

import { BadgeComponentProps } from './types';

import { Container } from './Badge.styles';

const Badge: React.FC<BadgeComponentProps> = ({ variant, ...props }) => {
  return <Container $variant={variant} {...props} />;
};

export default Badge;
