import styled from 'styled-components/macro';

import { UserNavbarProps } from './types';

export const Container = styled.div<Omit<UserNavbarProps, 'data'>>``;
