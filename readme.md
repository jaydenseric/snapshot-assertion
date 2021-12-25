# snapshot-assertion

[![npm version](https://badgen.net/npm/v/snapshot-assertion)](https://npm.im/snapshot-assertion) [![CI status](https://github.com/jaydenseric/snapshot-assertion/workflows/CI/badge.svg)](https://github.com/jaydenseric/snapshot-assertion/actions)

Asserts a string matches a snapshot saved in a file. An environment variable can be used to save rather than assert snapshots.

## Installation

To install with [npm](https://npmjs.com/get-npm), run:

```sh
npm install snapshot-assertion --save-dev
```

## API

### function assertSnapshot

Asserts a string matches a snapshot saved in a file. A truthy `SAVE_SNAPSHOTS` environment variable can be used to save rather than assert snapshots.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `actualValue` | string | Actual value to assert matches the snapshot expected value. |
| `snapshotFile` | string \| URL | Snapshot file path or URL. Be sure any directories in the path already exist. It’s a good idea to use a filename extension suited to the data, e.g. `.json`, `.yml`, `.xml`, `.html`, `.md`, or `.txt`. |
| `assertion` | Function? | Assertion that receives actual and expected values and throws an error if they don’t match. Defaults to the Node.js [`strictEqual`](https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message) assertion. |

**Returns:** Promise\<void> — Resolves once the snapshot has been saved or asserted.

#### Examples

_Ways to import._

> ```js
> import assertSnapshot from "snapshot-assertion";
> ```
>
> ```js
> import assertSnapshot from "snapshot-assertion/assertSnapshot.mjs";
> ```

_A snapshot assertion in a [`test-director`](https://npm.im/test-director) test._

> ```js
> import fetch from "node-fetch";
> import assertSnapshot from "snapshot-assertion";
> import TestDirector from "test-director";
>
> const tests = new TestDirector();
>
> tests.add("Get a todo.", async () => {
>   const response = await fetch(
>     "https://jsonplaceholder.typicode.com/todos/1"
>   );
>   await assertSnapshot(await response.json(), "snapshots/todo.json");
> });
>
> tests.run();
> ```
