import { DependencyList, useEffect } from 'react';

const useAsyncEffect = <D = any>(
  callback: (isMounted: () => boolean) => D | Promise<D>,
  onDestroyOrDependencies: null | ((result?: D) => void) | DependencyList,
  dependencies: DependencyList = [],
) => {
  let deps: DependencyList;
  let destroy: (result?: D) => void;

  if (typeof onDestroyOrDependencies === 'function') {
    destroy = onDestroyOrDependencies;
    deps = dependencies;
  } else {
    deps = onDestroyOrDependencies || [];
  }

  useEffect(() => {
    let result: D;
    let mounted = true;

    const maybePromise = callback(() => {
      return mounted;
    });

    Promise.resolve(maybePromise).then((value) => {
      result = value;
    });

    return () => {
      mounted = false;
      destroy?.(result);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAsyncEffect;
