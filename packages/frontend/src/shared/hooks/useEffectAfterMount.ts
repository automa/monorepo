import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const useAsyncEffect = (
  effect: EffectCallback,
  dependencies: DependencyList = [],
) => {
  let didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      effect();
    } else {
      didMountRef.current = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useAsyncEffect;
