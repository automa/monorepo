import { createTwc, cx } from 'react-twc';
import { twMerge } from 'tailwind-merge';

export const tw = createTwc({
  compose: (...inputs) => twMerge(cx(inputs)),
});

export const twp = (strings: TemplateStringsArray) => strings[0];

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
//   const ButtonContainer = tw.button<Styled<ButtonProps>>``;
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
