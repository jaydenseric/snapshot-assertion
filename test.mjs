import { doesNotReject, rejects, strictEqual } from "assert";
import { execFile } from "child_process";
import fs from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import disposableDirectory from "disposable-directory";
import TestDirector from "test-director";
import assertSnapshot from "./assertSnapshot.mjs";

const execFilePromise = promisify(execFile);
const tests = new TestDirector();

tests.add("`assertSnapshot` with default assertion.", async () => {
  await disposableDirectory(async (tempDirPath) => {
    const snapshotPath = join(tempDirPath, "snapshot.txt");

    await fs.promises.writeFile(snapshotPath, "a");

    await doesNotReject(() => assertSnapshot("a", snapshotPath));
    await rejects(() => assertSnapshot("b", snapshotPath), {
      code: "ERR_ASSERTION",
    });
  });
});

tests.add("`assertSnapshot` with custom assertion.", async () => {
  await disposableDirectory(async (tempDirPath) => {
    const snapshotPath = join(tempDirPath, "snapshot.json");

    await fs.promises.writeFile(snapshotPath, "a");

    const errorMessage = "Different values.";

    /**
     * Asserts one value is another.
     * @kind function
     * @name assertIs
     * @param {*} actual Actual value.
     * @param {*} expected Expected value.
     * @ignore
     */
    function assertIs(actual, expected) {
      if (!Object.is(actual, expected)) throw new Error(errorMessage);
    }

    await doesNotReject(() => assertSnapshot("a", snapshotPath, assertIs));
    await rejects(() => assertSnapshot("b", snapshotPath, assertIs), {
      name: "Error",
      message: errorMessage,
    });
  });
});

tests.add("`assertSnapshot` with invalid snapshot file path.", async () => {
  await rejects(() => assertSnapshot("a", false), {
    code: "ERR_INVALID_ARG_TYPE",
  });
});

tests.add("`assertSnapshot` with missing snapshot file.", async () => {
  await disposableDirectory(async (tempDirPath) => {
    const snapshotPath = join(tempDirPath, "snapshot.txt");

    await rejects(() => assertSnapshot("a", snapshotPath), {
      name: "Error",
      message: `Use the environment variable \`SAVE_SNAPSHOTS=1\` to create missing snapshot \`${snapshotPath}\`.`,
    });
  });
});

tests.add(
  "`assertSnapshot` with environment variable `SAVE_SNAPSHOTS=1`.",
  async () => {
    await disposableDirectory(async (tempDirPath) => {
      const snapshotPath = join(tempDirPath, "snapshot.txt");
      const testPath = join(tempDirPath, "test.mjs");
      const snapshotAssertionPath = fileURLToPath(
        new URL("./assertSnapshot.mjs", import.meta.url)
      );

      await Promise.all([
        fs.promises.writeFile(snapshotPath, "a"),
        fs.promises.writeFile(
          testPath,
          `import assertSnapshot from "${snapshotAssertionPath}";

assertSnapshot("b", "${snapshotPath}");
`
        ),
      ]);

      await execFilePromise("node", [testPath], {
        env: {
          ...process.env,
          SAVE_SNAPSHOTS: "1",
        },
      });

      strictEqual(await fs.promises.readFile(snapshotPath, "utf8"), "b");
    });
  }
);

tests.run();
