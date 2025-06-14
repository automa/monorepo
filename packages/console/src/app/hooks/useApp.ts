import { useAppDispatch, useAppSelector } from 'store';

import { App } from 'gql/graphql';

import { selectApp, setApp as set, unsetApp as unset } from 'app/slices';

const useApp = () => {
  const dispatch = useAppDispatch();

  const app = useAppSelector(selectApp);

  const setApp = (app: App) => {
    dispatch(set(app));
  };

  const unsetApp = () => {
    dispatch(unset());
  };

  return {
    setApp,
    unsetApp,
    app: app as App,
  };
};

export default useApp;
