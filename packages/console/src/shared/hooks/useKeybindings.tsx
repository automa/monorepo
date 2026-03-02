import { DependencyList, ReactNode, useMemo } from 'react';
import { HotkeyCallback, Options, useHotkeys } from 'react-hotkeys-hook';

import { tw } from 'theme';

import { Flex, Tooltip } from 'shared/components';

type KeyPress = {
  key: string;
  mod?: boolean;
  alt?: boolean;
  shift?: boolean;
};

export type Keybinding = {
  shortcut: KeyPress[] | KeyPress | string;
  description: string;
  action: HotkeyCallback;
};

const isMac = navigator.platform.toLowerCase().includes('mac');

const KeySymbol = tw.kbd`min-w-4 rounded p-0.5 text-center align-middle`;

const useKeybindings = (
  bindings: Keybinding[] | Keybinding,
  options: Options | DependencyList = {},
  dependencies: DependencyList = [],
) => {
  if (Array.isArray(options)) {
    dependencies = options;
    options = {};
  }

  const cleanedBindings = useMemo(
    () =>
      (Array.isArray(bindings) ? bindings : [bindings]).map((binding) => {
        if (typeof binding.shortcut === 'string') {
          return {
            ...binding,
            shortcut: [
              {
                key: binding.shortcut,
              },
            ],
          };
        } else if (!Array.isArray(binding.shortcut)) {
          return {
            ...binding,
            shortcut: [binding.shortcut],
          };
        }

        return binding;
      }),
    [bindings],
  );

  const hotkeys = useMemo(
    () =>
      cleanedBindings.map(({ shortcut, ...binding }) => ({
        ...binding,
        hotkey: (shortcut as KeyPress[])
          .map(({ mod, alt, shift, key }) =>
            [mod && 'mod', alt && 'alt', shift && 'shift', key]
              .filter(Boolean)
              .join('+'),
          )
          .join('>'),
      })),
    [cleanedBindings],
  );

  const ref = useHotkeys(
    hotkeys.map(({ hotkey }) => hotkey),
    (event, handler) => {
      hotkeys
        .find(({ hotkey }) => hotkey === handler.hotkey)
        ?.action(event, handler);
    },
    options,
    [hotkeys, ...dependencies],
  );

  const tooltip = useMemo(() => {
    const contents = cleanedBindings.map(({ shortcut, description }, index) => {
      const texts = (shortcut as KeyPress[]).map(
        ({ key, mod = false, alt = false, shift = false }) => {
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
            <>
              {modSymbol}
              {altSymbol}
              {shiftSymbol}
              <KeySymbol>{keyLabel}</KeySymbol>
            </>
          );
        },
      );

      return (
        <Flex key={index} alignItems="center">
          {texts.map((text, i) => (
            <Flex key={i} className="mr-1 gap-1">
              {i != 0 && 'then'}
              {text}
            </Flex>
          ))}
          <span>to {description}</span>
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
  }, [cleanedBindings]);

  return {
    Tooltip: tooltip,
    ref,
  };
};

export default useKeybindings;
