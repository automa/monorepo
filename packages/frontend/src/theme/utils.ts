import styled, { css, DefaultTheme } from 'styled-components/macro';

type CssValue = number | string;

type CssValues =
  | CssValue
  | [CssValue]
  | [CssValue, CssValue]
  | [CssValue, CssValue, CssValue]
  | [CssValue, CssValue, CssValue, CssValue];

interface CommonProps {
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
  val !== undefined &&
  (typeof val === 'string' ? `${val}` : `${theme.spacing(val)}px`);

const cssLine =
  (key: string, cssKey: string) =>
  ({
    theme,
    ...props
  }: {
    theme: DefaultTheme;
  } & CommonProps) =>
    css`
      ${cssKey}: ${
        // @ts-ignore
        cssValue(theme, props[key])
      };
    `;

const cssFour =
  (key: string, cssKey: string) =>
  ({ theme, ...props }: { theme: DefaultTheme } & CommonProps) => {
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

export const CommonWrapper = <T>(component: (args: T) => JSX.Element | null) =>
  styled((props: Common<T>) => {
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

    return component(componentProps as T);
  })<Common<T>>`
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
// `SR` are the props used in the component and also required in styled component.
// They will be prefixed with `$` for the styled component.
//
// `SO` are the props used in the component and also used optionally in styled component.
// They will be prefixed with `$` for the styled component.
//
// **NOTE**: Would not recommend including any `HTMLAttributes` in the above.
//
// `C` are the props used only in the component. If they contain `HTMLAttributes`,
// they can be forwarded to styled component as the base element props without any
// modifications.
//
//   ```
//   export type ButtonProps = $<{
//     // This will be `?` in component props only
//     checked?: boolean;
//   }, {
//     // This will be `?` in both component and styled props
//     color: Property.Color;
//   }, React.HTMLAttributes<HTMLButtonElement>>;
//   ```
//
// All the component props are available under `Component<Type>`.
//
//   ```
//   const Button: React.FC<Component<ButtonProps>> = ({
//     checked = false,
//     color,
//     ...props
//   }) => {
//     return <ButtonContainer {...props} $checked={checked} $color={color} />;
//   };
//   ```
//
// All the styled props are available under `Styled<Type>`.
//
//   ```
//   const ButtonContainer = styled.button<Styled<ButtonProps>>``;
//   ```
export type $<SR, SO, C> = {
  componentDirect: SR & C;
  componentStyledOptional: {
    [K in keyof SO]?: SO[K];
  };
  styledRequired: {
    [K in keyof SR as `$${Extract<K, string>}`]-?: SR[K];
  };
  styledOptional: {
    [K in keyof SO as `$${Extract<K, string>}`]?: SO[K];
  };
};

export type Component<T> = T extends {
  componentDirect: unknown;
  componentStyledOptional: unknown;
  styledRequired: unknown;
  styledOptional: unknown;
}
  ? T['componentDirect'] & T['componentStyledOptional']
  : T;

export type Styled<T> = T extends {
  componentDirect: unknown;
  componentStyledOptional: unknown;
  styledRequired: unknown;
  styledOptional: unknown;
}
  ? T['styledRequired'] & T['styledOptional']
  : T;

export type Common<T> = T & CommonProps;
