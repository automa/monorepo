import { ReactNode, useEffect, useMemo } from 'react';
import styled from 'styled-components/macro';

import { Tooltip, Flex } from 'shared/components';

export type Keybinding = (
  | {
      key: string;
      mod?: boolean;
      alt?: boolean;
      shift?: boolean;
    }
  | {
      key: string[];
      mod?: never;
      alt?: never;
      shift?: never;
    }
) & {
  description: string;
  action: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
};

const KeySymbol = styled.kbd`
  padding: ${({ theme }) => theme.spacing(0.25)}px;
  border-radius: ${({ theme }) => theme.spacing(0.5)}px;
  background-color: ${({ theme }) => theme.colors.body};
  min-width: ${({ theme }) => theme.spacing(2)}px;
  text-align: center;
`;

const useKeybindings = (bindings: Keybinding[]) => {
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      for (const binding of bindings) {
        const {
          key,
          mod = false,
          alt = false,
          shift = false,
          action,
          preventDefault = false,
        } = binding;

        if (Array.isArray(key)) {
          continue;
        }

        let modPressed = event.ctrlKey || event.metaKey;

        if (
          key.toLowerCase() === event.key.toLowerCase() &&
          mod === modPressed &&
          alt === event.altKey &&
          shift === event.shiftKey
        ) {
          if (preventDefault) {
            event.preventDefault();
          }

          event.stopPropagation();

          action(event);
          return;
        }
      }
    };

    window.addEventListener('keydown', handle);

    return () => window.removeEventListener('keydown', handle);
  }, [bindings]);

  const tooltips = useMemo(() => {
    const isMac = navigator.platform.toLowerCase().includes('mac');

    return bindings.map((binding) => {
      const {
        key,
        mod = false,
        alt = false,
        shift = false,
        description,
      } = binding;

      if (Array.isArray(key)) {
        return null;
      }

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

      if (keyText === ' ') {
        keyLabel = '␣';
      } else if (keyText === 'enter') {
        keyLabel = '⏎';
      } else if (keyText === 'backspace') {
        keyLabel = '⌫';
      } else if (keyText === 'tab') {
        keyLabel = '⇥';
      } else if (keyText === 'arrowup') {
        keyLabel = '↑';
      } else if (keyText === 'arrowdown') {
        keyLabel = '↓';
      } else if (keyText === 'arrowleft') {
        keyLabel = '←';
      } else if (keyText === 'arrowright') {
        keyLabel = '→';
      } else if (keyText === 'delete') {
        keyLabel = 'Del';
      } else if (keyText === 'escape') {
        keyLabel = 'Esc';
      } else {
        keyLabel = keyText.toUpperCase();
      }

      return ({ children }: { children: ReactNode }) => (
        <Tooltip
          content={() => (
            <Flex alignItems="center">
              <Flex gap={0.5} marginRight={0.5}>
                {modSymbol}
                {altSymbol}
                {shiftSymbol}
                <KeySymbol>{keyLabel}</KeySymbol>
              </Flex>
              to {description}
            </Flex>
          )}
        >
          {children}
        </Tooltip>
      );
    });
  }, [bindings]);

  return {
    tooltips,
  };
};

export default useKeybindings;
