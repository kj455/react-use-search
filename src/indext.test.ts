import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSearch } from '.';
import { FilterOption } from './types';

type Data = {
  id: number;
  age: number;
  visible: boolean;
};
const initialState: Data[] = [
  { id: 1, age: 30, visible: true },
  { id: 2, age: 40, visible: true },
  { id: 3, age: 50, visible: false },
  { id: 4, age: 10, visible: true },
  { id: 5, age: 20, visible: false },
  { id: 6, age: 20, visible: false },
];

describe('useSearch', () => {
  test('should return initialState', () => {
    const { result } = renderHook(() => useSearch(initialState, {}));
    const { results } = result.current;

    expect(results).toStrictEqual(initialState);
  });

  describe('filter', () => {
    test('should return filteredState', async () => {
      const { result } = renderHook(() =>
        useSearch(initialState, {
          filterOptions: {
            VISIBLE: {
              condition: (data: Data) => data.visible,
            },
          },
        })
      );
      expect(result.current.results).toStrictEqual(initialState);

      act(() => {
        result.current.setFilter('VISIBLE');
      });
      expect(result.current.results).toStrictEqual([
        { id: 1, age: 30, visible: true },
        { id: 2, age: 40, visible: true },
        { id: 4, age: 10, visible: true },
      ]);

      act(() => {
        result.current.resetFilter();
      });
      expect(result.current.results).toStrictEqual(initialState);
    });
  });

  describe('sort', () => {
    test('should return sortedState', async () => {
      const { result } = renderHook(() =>
        useSearch(initialState, {
          sortOptions: {
            AGE_ASC: {
              rule: (a: Data, b: Data) => a.age - b.age,
            },
            AGE_DESC: {
              rule: (a: Data, b: Data) => b.age - a.age,
            },
            ID_ASC: {
              rule: (a: Data, b: Data) => a.id - b.id,
            },
            ID_DESC: {
              rule: (a: Data, b: Data) => b.id - a.id,
            },
          },
        })
      );
      expect(result.current.results).toStrictEqual(initialState);

      act(() => {
        result.current.addSort('ID_DESC');
      });
      expect(result.current.results).toStrictEqual([
        { id: 6, age: 20, visible: false },
        { id: 5, age: 20, visible: false },
        { id: 4, age: 10, visible: true },
        { id: 3, age: 50, visible: false },
        { id: 2, age: 40, visible: true },
        { id: 1, age: 30, visible: true },
      ]);

      act(() => {
        result.current.addSort('AGE_ASC');
      });
      expect(result.current.results).toStrictEqual([
        { id: 4, age: 10, visible: true },
        { id: 6, age: 20, visible: false },
        { id: 5, age: 20, visible: false },
        { id: 1, age: 30, visible: true },
        { id: 2, age: 40, visible: true },
        { id: 3, age: 50, visible: false },
      ]);
    });
  });
});
