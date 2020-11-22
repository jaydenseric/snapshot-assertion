'use strict'

const { doesNotReject, rejects, strictEqual } = require('assert')
const { execFile } = require('child_process')
const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { disposableDirectory } = require('disposable-directory')
const { TestDirector } = require('test-director')
const snapshot = require('.')

const execFilePromise = promisify(execFile)

const tests = new TestDirector()

tests.add('`snapshot` with default assertion.', async () => {
  await disposableDirectory(async (tempDirPath) => {
    const snapshotPath = join(tempDirPath, 'snapshot.txt')
    await fs.promises.writeFile(snapshotPath, 'a')
    await doesNotReject(() => snapshot('a', snapshotPath))
    await rejects(() => snapshot('b', snapshotPath), {
      code: 'ERR_ASSERTION',
    })
  })
})

tests.add('`snapshot` with custom assertion.', async () => {
  await disposableDirectory(async (tempDirPath) => {
    const snapshotPath = join(tempDirPath, 'snapshot.json')
    await fs.promises.writeFile(snapshotPath, 'a')

    const errorMessage = 'Different values.'

    /**
     * Asserts one value is another.
     * @kind function
     * @name assertIs
     * @param {*} actual Actual value.
     * @param {*} expected Expected value.
     * @ignore
     */
    function assertIs(actual, expected) {
      if (!Object.is(actual, expected)) throw new Error(errorMessage)
    }

    await doesNotReject(() => snapshot('a', snapshotPath, assertIs))
    await rejects(() => snapshot('b', snapshotPath, assertIs), {
      name: 'Error',
      message: errorMessage,
    })
  })
})

tests.add('`snapshot` with invalid snapshot file path.', async () => {
  await rejects(() => snapshot('a', false), { code: 'ERR_INVALID_ARG_TYPE' })
})

tests.add('`snapshot` with missing snapshot file.', async () => {
  await disposableDirectory(async (tempDirPath) => {
    const snapshotPath = join(tempDirPath, 'snapshot.txt')
    await rejects(() => snapshot('a', snapshotPath), {
      name: 'Error',
      message: `Use the environment variable \`SAVE_SNAPSHOTS=1\` to create missing snapshot \`${snapshotPath}\`.`,
    })
  })
})

tests.add(
  '`snapshot` with environment variable `SAVE_SNAPSHOTS=1`.',
  async () => {
    await disposableDirectory(async (tempDirPath) => {
      const snapshotPath = join(tempDirPath, 'snapshot.txt')
      const testPath = join(tempDirPath, 'test.js')

      await fs.promises.writeFile(snapshotPath, 'a')
      await fs.promises.writeFile(
        testPath,
        `require('${join(__dirname, 'index.js')}')('b', '${snapshotPath}')`
      )

      await execFilePromise('node', [testPath], {
        env: { ...process.env, SAVE_SNAPSHOTS: '1' },
      })

      strictEqual(await fs.promises.readFile(snapshotPath, 'utf8'), 'b')
    })
  }
)

tests.run()
