import { ReactNode } from 'react';

import { ScreenSize } from 'theme';

export type ScreenSizeHelperProps = {
  children: ReactNode;
};

export type ScreenSizeProps = ScreenSize & ScreenSizeHelperProps;
