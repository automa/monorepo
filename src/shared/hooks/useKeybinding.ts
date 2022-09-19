import { useEffect } from 'react';

export type Keybinding =
  | string
  | {
      key: string;
      shiftKey?: boolean;
      ctrlKey?: boolean;
      altKey?: boolean;
      metaKey?: boolean;
    };

const useKeybinding = (binding: Keybinding, callback: () => void) => {
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (typeof binding === 'string') {
        if (binding === event.key) {
          callback();
        }
      } else {
        if (
          binding.key === event.key &&
          (binding.shiftKey ?? false) === event.shiftKey &&
          (binding.ctrlKey ?? false) === event.ctrlKey &&
          (binding.altKey ?? false) === event.altKey &&
          (binding.metaKey ?? false) === event.metaKey
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
