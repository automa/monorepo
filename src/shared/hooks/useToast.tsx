import { useEffect, useState } from 'react';

import { ToastComponentProps } from 'shared/components';

const TOAST_REMOVE_DELAY = 5000;

enum ActionType {
  ADD_TOAST,
  UPDATE_TOAST,
  DISMISS_TOAST,
  REMOVE_TOAST,
}

type ToastProps = ToastComponentProps & {
  id: string;
};

type Action =
  | {
      type: ActionType.ADD_TOAST;
      toast: ToastProps;
    }
  | {
      type: ActionType.UPDATE_TOAST;
      toast: ToastProps;
    }
  | {
      type: ActionType.DISMISS_TOAST;
      toastId?: ToastProps['id'];
    }
  | {
      type: ActionType.REMOVE_TOAST;
      toastId?: ToastProps['id'];
    };

type State = {
  toasts: ToastProps[];
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: ActionType.REMOVE_TOAST,
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts],
      };

    case ActionType.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case ActionType.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case ActionType.REMOVE_TOAST: {
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    }
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = {
  toasts: [],
};

const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);

  listeners.forEach((listener) => {
    listener(memoryState);
  });
};

let count = 0;

const toast = ({ ...props }: ToastComponentProps) => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  const id = count.toString();

  const update = (props: ToastProps) =>
    dispatch({
      type: ActionType.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: ActionType.DISMISS_TOAST, toastId: id });

  dispatch({
    type: ActionType.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    dismiss,
    update,
  };
};

const useToast = () => {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);

    return () => {
      const index = listeners.indexOf(setState);

      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
  };
};

export { useToast, toast };
