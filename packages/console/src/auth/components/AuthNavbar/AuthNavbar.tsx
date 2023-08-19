import React from 'react';

import { AuthNavbarProps } from './types';

import { Container } from './AuthNavbar.styles';

const AuthNavbar: React.FC<AuthNavbarProps> = ({ ...props }) => {
  return <Container {...props}></Container>;
};

export default AuthNavbar;
