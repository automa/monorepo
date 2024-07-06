import { DependencyList, ReactNode, useMemo } from 'react';
import { HotkeyCallback, Options, useHotkeys } from 'react-hotkeys-hook';

import { tw } from 'theme';

import { Flex, Tooltip } from 'shared/components';

export type Keybinding = {
  key: string;
  mod?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: HotkeyCallback;
};

const KeySymbol = tw.kbd`min-w-4 rounded p-0.5 text-center`;

const useKeybindings = (
  bindings: Keybinding[],
  options: Options | DependencyList = {},
  dependencies: DependencyList = [],
) => {
  if (Array.isArray(options)) {
    dependencies = options;
    options = {};
  }

  const keybindings = useMemo(
    () => (Array.isArray(bindings) ? bindings : [bindings]),
    [bindings],
  );

  const shortcuts = useMemo(
    () =>
      keybindings.map(({ mod, alt, shift, key }) =>
        [mod && 'mod', alt && 'alt', shift && 'shift', key]
          .filter(Boolean)
          .join('+'),
      ),
    [keybindings],
  );

  const ref = useHotkeys(
    shortcuts,
    (event, handler) => {
      const shortcut = keybindings.find(
        ({ mod = false, alt = false, shift = false, key }) =>
          handler.mod === mod &&
          handler.alt === alt &&
          handler.shift === shift &&
          handler.keys?.join('') === key,
      );

      if (shortcut) {
        shortcut.action(event, handler);
      }
    },
    options,
    [shortcuts, ...dependencies],
  );

  const tooltip = useMemo(() => {
    const isMac = navigator.platform.toLowerCase().includes('mac');

    const contents = bindings.map((binding, index) => {
      const {
        key,
        mod = false,
        alt = false,
        shift = false,
        description,
      } = binding;

      const modSymbol = mod ? (
        <KeySymbol>{isMac ? '⌘' : 'Ctrl'}</KeySymbol>
      ) : null;
      const altSymbol = alt ? (
        <KeySymbol>{isMac ? '⌥' : 'Alt'}</KeySymbol>
      ) : null;
      const shiftSymbol = shift ? (
        <KeySymbol>{isMac ? '⇧' : 'Shift'}</KeySymbol>
      ) : null;

      const keyText = key.toLowerCase();
      let keyLabel: string;

      if (keyText === 'space') {
        keyLabel = '␣';
      } else if (keyText === 'enter') {
        keyLabel = '⏎';
      } else if (keyText === 'backspace') {
        keyLabel = '⌫';
      } else if (keyText === 'tab') {
        keyLabel = '⇥';
      } else if (keyText === 'up') {
        keyLabel = '↑';
      } else if (keyText === 'down') {
        keyLabel = '↓';
      } else if (keyText === 'left') {
        keyLabel = '←';
      } else if (keyText === 'right') {
        keyLabel = '→';
      } else if (keyText === 'delete') {
        keyLabel = 'Del';
      } else if (keyText === 'escape') {
        keyLabel = 'Esc';
      } else {
        keyLabel = keyText.toUpperCase();
      }

      return (
        <Flex key={index} alignItems="center">
          <Flex className="mr-1 gap-1">
            {modSymbol}
            {altSymbol}
            {shiftSymbol}
            <KeySymbol>{keyLabel}</KeySymbol>
          </Flex>
          to {description}
        </Flex>
      );
    });

    const KeyTooltip = ({ children }: { children: ReactNode }) => (
      <Tooltip
        body={
          <Flex direction="column" className="gap-2">
            {contents}
          </Flex>
        }
      >
        {children}
      </Tooltip>
    );

    return KeyTooltip;
  }, [bindings]);

  return {
    Tooltip: tooltip,
    ref,
  };
};

export default useKeybindings;
