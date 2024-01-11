import styled from 'styled-components/macro';

import { OrgOverviewProps } from './types';

export const Container = styled.div<Omit<OrgOverviewProps, 'org'>>``;
