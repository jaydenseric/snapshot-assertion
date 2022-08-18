// @ts-check

import { strictEqual } from "node:assert";
import { readFile, writeFile } from "node:fs/promises";

/**
 * Asserts a string matches a snapshot saved in a file. A truthy
 * `SAVE_SNAPSHOTS` environment variable can be used to save rather than assert
 * snapshots.
 * @param {string} actualValue Actual value to assert matches the snapshot
 *   expected value.
 * @param {string | URL} snapshotFile Snapshot file path or URL. Be sure any
 *   directories in the path already exist. It’s a good idea to use a filename
 *   extension suited to the data, e.g. `.json`, `.yml`, `.xml`, `.html`, `.md`,
 *   or `.txt`.
 * @param {Function} [assertion] Assertion that receives actual and expected
 *   values and throws an error if they don’t match. Defaults to the Node.js
 *   [`strictEqual`](https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message)
 *   assertion.
 * @returns {Promise<void>} Resolves once the snapshot has been saved or
 *   asserted.
 * @example
 * A snapshot assertion in a [`test-director`](https://npm.im/test-director) test:
 *
 * ```js
 * import fetch from "node-fetch";
 * import assertSnapshot from "snapshot-assertion";
 * import TestDirector from "test-director";
 *
 * const tests = new TestDirector();
 *
 * tests.add("Get a todo.", async () => {
 *   const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
 *   await assertSnapshot(await response.json(), "snapshots/todo.json");
 * });
 *
 * tests.run();
 * ```
 */
export default async function assertSnapshot(
  actualValue,
  snapshotFile,
  assertion = strictEqual
) {
  if (typeof actualValue !== "string")
    throw new TypeError("Argument 1 `actualValue` must be a string.");

  if (typeof snapshotFile !== "string" && !(snapshotFile instanceof URL))
    throw new TypeError(
      "Argument 2 `snapshotFile` must be a string or `URL` instance."
    );

  if (typeof assertion !== "function")
    throw new TypeError("Argument 3 `assertion` must be a function.");

  if (process.env.SAVE_SNAPSHOTS) await writeFile(snapshotFile, actualValue);
  else {
    let expectedValue;

    try {
      expectedValue = await readFile(snapshotFile, "utf8");
    } catch (error) {
      throw typeof error === "object" &&
        // Not `null`.
        error &&
        // @ts-ignore It’s ok to check this property.
        error.code === "ENOENT"
        ? new Error(
            `Use the environment variable \`SAVE_SNAPSHOTS=1\` to create missing snapshot \`${snapshotFile}\`.`
          )
        : error;
    }

    assertion(actualValue, expectedValue);
  }
}
