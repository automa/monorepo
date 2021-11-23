import styled, { css, DefaultTheme } from 'styled-components';

type CssValue = number | string;

type CssValues =
  | CssValue
  | [CssValue]
  | [CssValue, CssValue]
  | [CssValue, CssValue, CssValue]
  | [CssValue, CssValue, CssValue, CssValue];

interface CssProps {
  margin?: CssValues;
  marginTop?: CssValue;
  marginRight?: CssValue;
  marginBottom?: CssValue;
  marginLeft?: CssValue;
  padding?: CssValues;
  paddingTop?: CssValue;
  paddingRight?: CssValue;
  paddingBottom?: CssValue;
  paddingLeft?: CssValue;
}

const cssValue = (theme: DefaultTheme, val?: CssValue) =>
  !!val && (typeof val === 'string' ? val : `${theme.spacing(val)}px`);

const cssLine =
  (key: string, cssKey: string) =>
  ({
    theme,
    ...props
  }: {
    theme: DefaultTheme;
  } & CssProps) =>
    css`
      ${cssKey}: ${
        // @ts-ignore
        cssValue(theme, props[key])
      };
    `;

const cssFour =
  (key: string, cssKey: string) =>
  ({ theme, ...props }: { theme: DefaultTheme } & CssProps) => {
    // @ts-ignore
    const val = props[key] as CssValues;
    let cssVal;

    if (Array.isArray(val)) {
      cssVal = val.map((item) => cssValue(theme, item)).join(' ');
    } else {
      cssVal = cssValue(theme, val);
    }

    return css`
      ${cssKey}: ${cssVal};
    `;
  };

export const CssWrapper = <T>(
  component: (args: Component<T>) => JSX.Element | null,
) =>
  styled((props: Component<T> & CssProps) => {
    const {
      margin,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      padding,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      ...componentProps
    } = props;

    // @ts-ignore
    return component(componentProps as Component<T>);
  })<Component<T> & CssProps>`
    ${cssFour('margin', 'margin')}
    ${cssLine('marginTop', 'margin-top')}
    ${cssLine('marginRight', 'margin-right')}
    ${cssLine('marginBottom', 'margin-bottom')}
    ${cssLine('marginLeft', 'margin-left')}
    ${cssFour('padding', 'padding')}
    ${cssLine('paddingTop', 'padding-top')}
    ${cssLine('paddingRight', 'padding-right')}
    ${cssLine('paddingBottom', 'padding-bottom')}
    ${cssLine('paddingLeft', 'padding-left')}
  `;

// Utility wrapper for building different types of props needed for a component.
//
// `S` are the props used in the component and also used in styled component.
// They will be prefixed with `$` for the styled component. Would not recommend
// including any `HTMLAttributes` in this.
//
// `N` are the props used only in the component. If they contain `HTMLAttributes`,
// they can be forwarded to styled component as the base element props without any
// modifications.
//
//   ```
//   export type ButtonProps = $<{
//     checked: boolean;
//   }, React.HTMLAttributes<HTMLButtonElement>;
//   ```
//
// All the component props are available under `Type['component']` or `Component<Type>`.
//
//   ```
//   const Button: React.FC<Component<ButtonProps>> = ({ checked, ...props }) => {
//     return <ButtonContainer {...props} $checked={checked} />;
//   };
//   ```
//
// All the styled props are available under `Type['styled']` or `Styled<Type>`.
//
//   ```
//   const ButtonContainer = styled.button<Styled<ButtonProps>>``;
//   ```
export type $<S, N> = {
  component: S & N;
  styled: {
    [K in keyof S as `$${Extract<K, string>}`]: S[K];
  };
};

export type Component<T> = T extends {
  component: unknown;
  styled: unknown;
}
  ? T['component']
  : T;

export type Styled<T> = T extends {
  component: unknown;
  styled: unknown;
}
  ? T['styled']
  : T;
