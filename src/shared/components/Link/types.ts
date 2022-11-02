import { To } from 'react-router-dom';

import { TypographyComponentProps } from 'shared/components/Typography';

export type LinkProps = TypographyComponentProps & {
  to: To;
};
