import React from 'react';

import { BannerProps } from './types';

const Banner: React.FC<BannerProps> = ({ ...props }) => {
  return (
    <div className="text-base font-light" {...props}>
      Automa is in <span className="font-bold">alpha</span>. Please report any
      issues to{' '}
      <a href="mailto:support@automa.app" className="font-semibold">
        support@automa.app
      </a>
    </div>
  );
};

export default Banner;
