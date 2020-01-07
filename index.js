'use strict'

const fs = require('fs')

/**
 * Asserts a string matches a snapshot saved in a file. A truthy
 * `SAVE_SNAPSHOTS` environment variable can be used to save rather than assert
 * snapshots.
 * @kind function
 * @name snapshot
 * @param {string} actualValue Actual value to assert matches the snapshot expected value.
 * @param {string} snapshotFilePath Snapshot file path. Be sure any directories in the path already exist. It’s a good idea to use a filename extension suited to the data, e.g. `.json`, `.yml`, `.xml`, `.html`, `.md` or `.txt`.
 * @param {Function} [assertion] Assertion that receives actual and expected values and throws an error if they don’t match. Defaults to the Node.js [`strictEqual`](https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message) assertion.
 * @returns {Promise<void>} Resolves once the snapshot has been saved or asserted.
 * @example <caption>A snapshot assertion in a [`test-director`](https://npm.im/test-director) test.</caption>
 * ```js
 * const fetch = require('node-fetch')
 * const snapshot = require('snapshot-assertion')
 * const { TestDirector } = require('test-director')
 *
 * const tests = new TestDirector()
 *
 * tests.add('Get a todo.', async () => {
 *   const response = await fetch('http://jsonplaceholder.typicode.com/todos/1')
 *   await snapshot(await response.json(), 'snapshots/todo.json')
 * })
 *
 * tests.run()
 * ```
 */
module.exports = async function snapshot(
  actualValue,
  snapshotFilePath,
  assertion = require('assert').strictEqual
) {
  if (process.env.SAVE_SNAPSHOTS)
    await fs.promises.writeFile(snapshotFilePath, actualValue)
  else {
    try {
      var expectedValue = await fs.promises.readFile(snapshotFilePath, 'utf8')
    } catch (error) {
      throw typeof error === 'object' && error && error.code === 'ENOENT'
        ? new Error(
            `Use the environment variable \`SAVE_SNAPSHOTS=1\` to create missing snapshot \`${snapshotFilePath}\`.`
          )
        : error
    }

    assertion(actualValue, expectedValue)
  }
}
