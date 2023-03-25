import { useEffect } from 'react';

export type Keybinding =
  | string
  | {
      key: string;
      mod?: boolean;
      alt?: boolean;
      shift?: boolean;
    };

const useKeybinding = (binding: Keybinding, callback: () => void) => {
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (typeof binding === 'string') {
        if (
          binding === event.key &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey &&
          !event.shiftKey
        ) {
          callback();
        }
      } else {
        let modKey = event.ctrlKey || event.metaKey;

        if (
          binding.key === event.key &&
          (binding.mod ?? false) === modKey &&
          (binding.alt ?? false) === event.altKey &&
          (binding.shift ?? false) === event.shiftKey
        ) {
          callback();
        }
      }
    };

    window.addEventListener('keydown', handle);

    return () => window.removeEventListener('keydown', handle);
  }, [binding, callback]);
};

export default useKeybinding;
