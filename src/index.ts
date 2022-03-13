import { useCallback, useMemo, useState } from 'react';

type FilterOption<T> = {
  condition: (val: T) => boolean;
  groupKey?: string;
};

type SortOption<T> = {
  rule: (a: T, b: T) => number;
};

type UseSearchResponse<T, FilterKey extends string, SortKey extends string> = {
  results: T[];
  filterOptions?: Record<FilterKey, FilterOption<T>>;
  filterKeyList: FilterKey[];
  setFilter: (key: FilterKey) => void;
  addFilter: (key: FilterKey) => void;
  removeFilter: (key: FilterKey) => void;
  resetFilter: () => void;
  sortOptions?: Record<SortKey, SortOption<T>>;
  sortKeyList: SortKey[];
  setSort: (key: SortKey) => void;
  addSort: (key: SortKey) => void;
  removeSort: (key: SortKey) => void;
  resetSort: () => void;
};

type UseSearch = <T, FilterKey extends string, SortKey extends string>(
  list: T[],
  options: {
    filterOptions?: Record<FilterKey, FilterOption<T>>;
    sortOptions?: Record<SortKey, SortOption<T>>;
  },
  initKeys?: { filter?: FilterKey; sort?: SortKey }
) => UseSearchResponse<T, FilterKey, SortKey>;

export const useSearch: UseSearch = (
  list,
  { filterOptions, sortOptions },
  initKeys
) => {
  const [filterKeyList, setFilterKeyList] = useState(
    initKeys?.filter ? [initKeys.filter] : []
  );
  const [sortKeyList, setSortKeyList] = useState(
    initKeys?.sort ? [initKeys.sort] : []
  );

  const filtered = useMemo(() => {
    const isApplied = Array.from({ length: filterKeyList.length }, () => false);
    return filterKeyList.reduce((acc, key, idx) => {
      if (isApplied[idx]) return acc;

      const filter = filterOptions?.[key];
      if (!filter) return acc;

      if (filter.groupKey) {
        const sameKeyFilters = filterKeyList.filter((k, idx) => {
          const option = filterOptions[k];
          if (filter.groupKey === option.groupKey) isApplied[idx] = true;
          return filter.groupKey === option.groupKey;
        });

        const conditions = sameKeyFilters.map(
          (k) => filterOptions[k].condition
        );
        return acc.filter((val) => conditions.some((c) => c(val)));
      }

      return acc.filter(filter.condition);
    }, list);
  }, [filterKeyList, filterOptions, list]);

  const sorted = useMemo(
    () =>
      sortKeyList.reduce((acc, key) => {
        const sort = sortOptions?.[key];
        if (sort) {
          return acc.sort(sort.rule);
        }
        return acc;
      }, filtered),
    [filtered, sortKeyList, sortOptions]
  );

  return {
    results: sorted,

    filterOptions,
    filterKeyList,
    setFilter: useCallback((key) => {
      setFilterKeyList([key]);
    }, []),
    addFilter: useCallback(
      (key) => {
        if (filterKeyList.includes(key)) return;
        setFilterKeyList([...filterKeyList, key]);
      },
      [filterKeyList]
    ),
    removeFilter: useCallback(
      (key) => {
        setFilterKeyList(filterKeyList.filter((k) => k !== key));
      },
      [filterKeyList]
    ),
    resetFilter: useCallback(() => {
      setFilterKeyList([]);
    }, []),

    sortOptions,
    sortKeyList,
    setSort: useCallback((key) => {
      setSortKeyList([key]);
    }, []),
    addSort: useCallback(
      (key) => {
        if (sortKeyList.includes(key)) return;
        setSortKeyList([...sortKeyList, key]);
      },
      [sortKeyList]
    ),
    removeSort: useCallback(
      (key) => {
        setSortKeyList(sortKeyList.filter((k) => k !== key));
      },
      [sortKeyList]
    ),
    resetSort: useCallback(() => {
      setSortKeyList([]);
    }, []),
  };
};
