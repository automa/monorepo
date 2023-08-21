import React from 'react';

import { FooterProps } from './types';

const Footer: React.FC<FooterProps> = ({ ...props }) => {
  return <div className="m-5 flex" {...props}></div>;
};

export default Footer;
