import React from 'react';
import Image from 'next/image';

import { LogoProps } from './types';

const Logo: React.FC<LogoProps> = ({ ...props }) => {
  return (
    <div className="flex gap-2" {...props}>
      <Image src="/favicon.svg" alt="Automa Logo" width={32} height={32} />
      <div className="font-sans text-2xl text-black dark:text-gray-100">
        Automa
        <span className="ml-1 font-bold">Docs</span>
      </div>
    </div>
  );
};

export default Logo;
