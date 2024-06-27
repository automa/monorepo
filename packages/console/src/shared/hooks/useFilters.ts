import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export enum FilterType {
  Boolean,
}

type BooleanFilter = {
  type: FilterType.Boolean;
  true: {
    label: string;
    params: Record<string, any>;
  };
  false: {
    label: string;
    params: Record<string, any>;
  };
};

type Filter = BooleanFilter;

export type FiltersDefinition = {
  [key: string]: Filter;
};

const useFilters = (definition: FiltersDefinition) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterValues: {
    [key in keyof typeof definition]?: string | string[];
  } = useMemo(
    () =>
      Object.entries(definition).reduce((acc, [key, filter]) => {
        let value;
        const searchValue = searchParams.get(key);

        if (filter.type === FilterType.Boolean) {
          value = searchValue;
        }

        return {
          ...acc,
          [key]: value ?? undefined,
        };
      }, {}),
    [searchParams, definition],
  );

  const filterParams = useMemo(
    () =>
      Object.entries(definition).reduce((acc, [key, filter]) => {
        let params;
        const searchValue = searchParams.get(key);

        if (filter.type === FilterType.Boolean) {
          if (searchValue === 'true') {
            params = filter.true.params;
          } else if (searchValue === 'false') {
            params = filter.false.params;
          }
        }

        return {
          ...acc,
          ...params,
        };
      }, {}),
    [searchParams, definition],
  );

  const filterOptions: {
    [key in keyof typeof definition]: any;
  } = useMemo(
    () =>
      Object.entries(definition).reduce((acc, [key, filter]) => {
        let options;

        if (filter.type === FilterType.Boolean) {
          options = [
            {
              ...filter.false,
              value: 'false',
            },
            {
              ...filter.true,
              value: 'true',
            },
          ];
        }

        return {
          ...acc,
          [key]: options,
        };
      }, {}),
    [definition],
  );

  const filterChangeFns: {
    [key in keyof typeof definition]: (value: string | string[]) => void;
  } = useMemo(
    () =>
      Object.entries(definition).reduce((acc, [key, filter]) => {
        let fn;

        if (filter.type === FilterType.Boolean) {
          fn = (value: string) =>
            setSearchParams((searchParams) => {
              if (value === 'true' || value === 'false') {
                searchParams.set(key, value);
              } else {
                searchParams.delete(key);
              }

              return searchParams;
            });
        }

        return {
          ...acc,
          [key]: fn,
        };
      }, {}),
    [setSearchParams, definition],
  );

  return {
    filterValues,
    filterParams,
    filterOptions,
    filterChangeFns,
  };
};

export default useFilters;
