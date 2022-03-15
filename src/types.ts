export type Options<T, FilterKey extends string, SortKey extends string> = {
  filterOptions?: Record<FilterKey, FilterOption<T>>;
  sortOptions?: Record<SortKey, SortOption<T>>;
};

export type FilterOption<T> = {
  condition: (val: T) => boolean;
  groupKey?: string;
};

export type SortOption<T> = {
  rule: (a: T, b: T) => number;
};

export type InitKeys<F, S> = {
  filter?: F;
  sort?: S;
};

export type UseSearchResponse<
  T,
  FilterKey extends string,
  SortKey extends string
> = {
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
