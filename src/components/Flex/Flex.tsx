import React from 'react';
import { useTheme } from 'styled-components/macro';
import QatalogFlex from '@qatalog/react-flex';

import { CommonWrapper } from 'theme';

import { FlexProps } from './types';

const Flex = CommonWrapper<FlexProps>(({ gap, ...props }) => {
  const theme = useTheme();

  return <QatalogFlex {...props} gap={gap && theme.spacing(gap)} />;
});

export default Flex;
