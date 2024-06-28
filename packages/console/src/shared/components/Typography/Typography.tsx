import React, { useMemo } from 'react';

import Anchor from '../Anchor';

import { TypographyComponentProps } from './types';

import { Container } from './Typography.styles';

const Typography: React.FC<TypographyComponentProps> = ({
  href,
  blank,
  anchor,
  to,
  link,
  disabled,
  element = 'div',
  variant,
  transform,
  align,
  whitespace,
  children,
  ...props
}) => {
  const As = useMemo(() => {
    switch (variant) {
      case 'title1':
        return 'h1';

      case 'title2':
        return 'h2';

      case 'title3':
        return 'h3';

      case 'title4':
        return 'h4';

      case 'title5':
        return 'h5';

      case 'title6':
        return 'h6';

      default:
        return element;
    }
  }, [element, variant]);

  return (
    <Anchor
      href={href}
      blank={blank}
      anchor={anchor}
      to={to}
      link={link}
      disabled={disabled}
    >
      <Container
        asChild
        $variant={variant}
        $transform={transform}
        $align={align}
        $whitespace={whitespace}
        {...props}
      >
        <As>{children}</As>
      </Container>
    </Anchor>
  );
};

export default Typography;
