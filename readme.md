# snapshot-assertion

Asserts a string matches a snapshot saved in a file. An environment variable can be used to save rather than assert snapshots.

## Installation

To install [`snapshot-assertion`](https://npm.im/snapshot-assertion) with [npm](https://npmjs.com/get-npm), run:

```sh
npm install snapshot-assertion --save-dev
```

## Examples

A snapshot assertion in a [`test-director`](https://npm.im/test-director) test:

```js
import fetch from "node-fetch";
import assertSnapshot from "snapshot-assertion";
import TestDirector from "test-director";

const tests = new TestDirector();

tests.add("Get a todo.", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  await assertSnapshot(await response.json(), "snapshots/todo.json");
});

tests.run();
```

Using the `SAVE_SNAPSHOTS` environment variable to save snapshots when running a package script:

```sh
SAVE_SNAPSHOTS=1 npm run test
```

## Requirements

Supported runtime environments:

- [Node.js](https://nodejs.org) versions `^14.17.0 || ^16.0.0 || >= 18.0.0`.

Projects must configure [TypeScript](https://typescriptlang.org) to use types from the ECMAScript modules that have a `// @ts-check` comment:

- [`compilerOptions.allowJs`](https://typescriptlang.org/tsconfig#allowJs) should be `true`.
- [`compilerOptions.maxNodeModuleJsDepth`](https://typescriptlang.org/tsconfig#maxNodeModuleJsDepth) should be reasonably large, e.g. `10`.
- [`compilerOptions.module`](https://typescriptlang.org/tsconfig#module) should be `"node16"` or `"nodenext"`.

## Exports

The [npm](https://npmjs.com) package [`snapshot-assertion`](https://npm.im/snapshot-assertion) features [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design). These ECMAScript modules are exported via the [`package.json`](./package.json) field [`exports`](https://nodejs.org/api/packages.html#exports):

- [`assertSnapshot.mjs`](./assertSnapshot.mjs)
