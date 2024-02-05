import { ButtonHTMLAttributes } from 'react';
import { Property } from 'csstype';

import theme, { $, Component, Styled } from 'theme';

type TextColor = keyof (typeof theme)['colors'] | Property.Color;

type ButtonSize = keyof (typeof theme)['buttons']['sizes'];

type ButtonVariant = keyof (typeof theme)['buttons']['variants'];

type ButtonProps = $<
  {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    fullWidth?: boolean;
  },
  {
    color?: TextColor;
  },
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>
>;

export type ButtonComponentProps = Component<ButtonProps>;

export type ButtonStyledProps = Styled<ButtonProps>;
