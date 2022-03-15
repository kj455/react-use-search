# 🪝 react-use-search

This hook allows you to implement complex filtering and sorting operations on arrays with ease.

## 🌟 features

- **type-safe** filter and sort operations
- **multiple** filter conditions supporting both `AND` and `OR`
- **multiple** sorting conditions

## 🚀 Install

```bash
npm i @kj455/react-use-search
```

```bash
yarn add @kj455/react-use-search
```

## 📚 Usage

### 📝 Summary

1. Pass the following arguments to this hook. ('?' means optional)

   - `list` : the array to filter or sort
   - `opsions` : an object containing the following properties. details below.
     - `filterOptions`?
     - `sortOptions`?
   - `initKeys`? : an object containing the keys for the initial filter/sort conditions.

2. Get returned values. `results` is an array of filtered and sorted items.
3. Call `addFilter(KEY_NAME)` or `addSort(KEY_NAME)` to add a new filter/sort condition.
4. other methods are available for advanced usage. details below.

```ts
const { results, addFilter } = useSearch(list, { filterOptions: {...}, ... });
```

### 📖 Details

#### ↪️ `filterOptions`

`filterOptions` is an object which key is the name of the filter condition and value is an object containing the following properties.

- `condition` : a function which takes an item in list and returns a boolean, which is used for `Array.filter()` method.
- `groupKey`? : if specified, conditions with the same `groupKey` will be combined with **`OR`** condition.

NOTE: By default, **`AND`** condition is used for filtering.

#### :twisted_rightwards_arrows: `sortOptions`

`sortOptions` is an object which key is the name of the sort condition and value is an object containing the following properties.

- `rule` : a function which takes an item in list and returns a number, which is used for `Array.sort()` method.

if multiple sort keys are specified, the items will be sorted by the first sort condition, then by the second sort condition, and so on.

#### 🐶 Basic example

Basic filtering. Demo [here](https://codesandbox.io/s/dreamy-mcclintock-w36fqq?file=/src/App.tsx).

```ts
export default function App() {
  const list = [...];
  const { results, addFilter, removeFilter } = useSearch(list, {
    filterOptions: {
      VISIBLE: {
        condition: (item) => item.isVisible,
      },
      WITH_IMAGE: {
        condition: (item) => !!item.imageUrl,
      },
    },
    sortOptions: {
      ID_DESC: {
        rule: (a, b) => a.id - b.id
      },
      ID_ASC: {
        rule: (a, b) => b.id - a.id
      }
    }
  });

  return (...);
}
```

#### 🐱 Advanced example

- Combination of `AND` and `OR` conditions
- Specification of initial filter key

Demo [here](https://codesandbox.io/s/solitary-surf-ehoudx?file=/src/App.tsx).

```ts
const list = [
  { id: 1, name: "piccachu", category: "POKEMON", isHuman: false },
  { id: 2, name: "mew", category: "POKEMON", isHuman: false },
  { id: 3, name: "mario", category: "SUPER_MARIO", isHuman: true },
  { id: 4, name: "pinokio", category: "SUPER_MARIO", isHuman: false }
];

export default function App() {
  const { results, filterKeyList, addFilter, removeFilter } = useSearch(list, {
    filterOptions: {
      HUMAN: {
        condition: (item) => item.isHuman
      },
      POKEMON: {
        condition: (item) => item.category === "POKEMON",
        groupKey: "anime"
      },
      SUPER_MARIO: {
        condition: (item) => item.category === "SUPER_MARIO",
        groupKey: "anime"
      }
    },
  }, { filter: 'POKEMON' });

  return (...)
}
```

#### :memo: All Returned Values

| name          | description                                               |
| ------------- | --------------------------------------------------------- |
| results       | Array after filtered and sorted                           |
| filterKeyList | Array of keys for the current filter conditions           |
| filterOptions | Object same as filterOption received as argument          |
| setFilter     | Function to set filter KEY after emptying `filterKeyList` |
| addFilter     | Function to add filter KEY to `filterKeyList`             |
| removeFilter  | Function to remove filter KEY from `filterKeyList`        |
| resetFilter   | Function to empty `filterKeyList`                         |
| sortKeyList   | Array of keys for the current sort rules                  |
| sortOptions   | Object same as sortOption received as argument            |
| setSort       | Function to set sort KEY after emptying `sortKeyList`     |
| addSort       | Function to add sort KEY to `sortKeyList`                 |
| removeSort    | Function to remove sort KEY from `sortKeyList`            |
| resetSort     | Function to empty `sortKeyList`                           |
