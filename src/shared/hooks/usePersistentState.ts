import useLocalStorageState, {
  LocalStorageState,
  LocalStorageOptions,
} from 'use-local-storage-state';

const usePersistentState = <T>(
  key: string,
  defaultValue?: T,
  options?: Omit<LocalStorageOptions<T>, 'defaultValue'>,
): LocalStorageState<T> =>
  useLocalStorageState(key, { ...options, defaultValue });

export default usePersistentState;
