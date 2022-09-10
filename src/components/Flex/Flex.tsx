import React from 'react';
import { useTheme } from 'styled-components/macro';
import QatalogFlex from '@qatalog/react-flex';

import { FlexProps } from './types';

const Flex: React.FC<FlexProps> = ({ gap, ...props }) => {
  const theme = useTheme();

  return <QatalogFlex {...props} gap={gap && theme.spacing(gap)} />;
};

export default Flex;
