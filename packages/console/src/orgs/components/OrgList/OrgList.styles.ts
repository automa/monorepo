import styled from 'styled-components/macro';

import { OrgListProps } from './types';

export const Container = styled.div<Omit<OrgListProps, 'data'>>``;
