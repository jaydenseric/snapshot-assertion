# snapshot-assertion

[![npm version](https://badgen.net/npm/v/snapshot-assertion)](https://npm.im/snapshot-assertion) [![CI status](https://github.com/jaydenseric/snapshot-assertion/workflows/CI/badge.svg)](https://github.com/jaydenseric/snapshot-assertion/actions)

Asserts a string matches a snapshot saved in a file. An environment variable can be used to save rather than assert snapshots.

## Installation

To install with [npm](https://npmjs.com/get-npm), run:

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

## Exports

These ECMAScript modules are published to [npm](https://npmjs.com) and exported via the [`package.json`](./package.json) `exports` field:

- [`assertSnapshot.mjs`](./assertSnapshot.mjs)
