# snapshot-assertion

[![npm version](https://badgen.net/npm/v/snapshot-assertion)](https://npm.im/snapshot-assertion) [![CI status](https://github.com/jaydenseric/snapshot-assertion/workflows/CI/badge.svg)](https://github.com/jaydenseric/snapshot-assertion/actions)

Asserts a string matches a snapshot saved in a file. An environment variable can be used to save rather than assert snapshots.

## Setup

To install from [npm](https://npmjs.com) run:

```sh
npm install snapshot-assertion --save-dev
```

## API

### Table of contents

- [function snapshot](#function-snapshot)

### function snapshot

Asserts a string matches a snapshot saved in a file. A truthy `SAVE_SNAPSHOTS` environment variable can be used to save rather than assert snapshots.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `actualValue` | string | Actual value to assert matches the snapshot expected value. |
| `snapshotFilePath` | string | Snapshot file path. Be sure any directories in the path already exist. It’s a good idea to use a filename extension suited to the data, e.g. `.json`, `.yml`, `.xml`, `.html`, `.md` or `.txt`. |
| `assertion` | Function? | Assertion that receives actual and expected values and throws an error if they don’t match. Defaults to the Node.js [`strictEqual`](https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message) assertion. |

**Returns:** Promise&lt;void> — Resolves once the snapshot has been saved or asserted.

#### Examples

_How to `import`._

> ```js
> import snapshot from 'snapshot-assertion';
> ```

_How to `require`._

> ```js
> const snapshot = require('snapshot-assertion');
> ```

_A snapshot assertion in a [`test-director`](https://npm.im/test-director) test._

> ```js
> const fetch = require('node-fetch');
> const snapshot = require('snapshot-assertion');
> const { TestDirector } = require('test-director');
>
> const tests = new TestDirector();
>
> tests.add('Get a todo.', async () => {
>   const response = await fetch('http://jsonplaceholder.typicode.com/todos/1');
>   await snapshot(await response.json(), 'snapshots/todo.json');
> });
>
> tests.run();
> ```
