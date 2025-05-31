import React from 'react';

import { LoaderComponentProps } from './types';

import { Container, Image } from './Loader.styles';

const Loader: React.FC<LoaderComponentProps> = ({ size, ...props }) => {
  return (
    <Container {...props}>
      <Image
        $size={size}
        alt="loading"
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjY4ODcgNTMuODA5M0M1LjkzNTk3IDQ3LjkzMjcgLTAuMDAwNDQ0Mjk3IDM4LjMyNjkgMCAyNS4xODY4QzAuMDAwODQ1MTYyIDAuMTkzMjE3IDYzLjk5OTIgMC4xOTMyMTcgNjQgMjUuMTg2OEM2NC4wMDA1IDM4LjMyNjkgNTguMDY0IDQ3LjkzMjcgNDYuMzExMyA1My44MDkzQzM2LjMxMzYgNTguODA4MyAyNy42ODY0IDU4LjgwODMgMTcuNjg4NyA1My44MDkzWiIgZmlsbD0iI0RCNDc1RSIvPgo8ZWxsaXBzZSBjeD0iMTguMjg5OCIgY3k9IjI5LjE5MzkiIHJ4PSI1LjcyNDUxIiByeT0iOC41ODY3NiIgZmlsbD0id2hpdGUiLz4KPGVsbGlwc2UgY3g9IjQ1Ljc2NzUiIGN5PSIyOS4xOTM5IiByeD0iNS43MjQ1MSIgcnk9IjguNTg2NzYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="
      />
    </Container>
  );
};

export default Loader;
