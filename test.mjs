// @ts-check

import { doesNotReject, rejects, strictEqual } from "assert";
import { execFile } from "child_process";
import disposableDirectory from "disposable-directory";
import fs from "fs";
import { join } from "path";
import TestDirector from "test-director";
import { fileURLToPath, pathToFileURL } from "url";
import { promisify } from "util";

import assertSnapshot from "./assertSnapshot.mjs";

const execFilePromise = promisify(execFile);
const tests = new TestDirector();

tests.add(
  "`assertSnapshot` with argument 1 `actualValue` not a string.",
  async () => {
    await rejects(
      assertSnapshot(
        // @ts-ignore Testing invalid.
        true,
        "snapshot.txt"
      ),
      new TypeError("Argument 1 `actualValue` must be a string.")
    );
  }
);

tests.add(
  "`assertSnapshot` with argument 2 `snapshotFile` not a string or `URL` instance.",
  async () => {
    await rejects(
      assertSnapshot(
        "a",
        // @ts-ignore Testing invalid.
        true
      ),
      new TypeError(
        "Argument 2 `snapshotFile` must be a string or `URL` instance."
      )
    );
  }
);

tests.add(
  "`assertSnapshot` with argument 3 `assertion` not a function.",
  async () => {
    await rejects(
      assertSnapshot(
        "a",
        "snapshot.txt",
        // @ts-ignore Testing invalid.
        true
      ),
      new TypeError("Argument 3 `assertion` must be a function.")
    );
  }
);

tests.add(
  "`assertSnapshot` with snapshot file URL, invalid scheme.",
  async () => {
    await rejects(assertSnapshot("a", new URL("http://localhost")), TypeError);
  }
);

tests.add(
  "`assertSnapshot` with snapshot file URL, assertion default, snapshot present.",
  async () => {
    await disposableDirectory(async (tempDirPath) => {
      const snapshotFileUrl = pathToFileURL(join(tempDirPath, "snapshot.txt"));

      await fs.promises.writeFile(snapshotFileUrl, "a");

      await doesNotReject(assertSnapshot("a", snapshotFileUrl));
      await rejects(assertSnapshot("b", snapshotFileUrl), {
        code: "ERR_ASSERTION",
      });
    });
  }
);

tests.add(
  "`assertSnapshot` with snapshot file path, assertion default, snapshot file missing, `SAVE_SNAPSHOTS` env var missing.",
  async () => {
    await disposableDirectory(async (tempDirPath) => {
      const snapshotFilePath = join(tempDirPath, "snapshot.txt");

      await rejects(
        assertSnapshot("a", snapshotFilePath),
        new Error(
          `Use the environment variable \`SAVE_SNAPSHOTS=1\` to create missing snapshot \`${snapshotFilePath}\`.`
        )
      );
    });
  }
);

tests.add(
  "`assertSnapshot` with snapshot file path, assertion default, snapshot file missing, `SAVE_SNAPSHOTS` env var present.",
  async () => {
    await disposableDirectory(async (tempDirPath) => {
      const snapshotFilePath = join(tempDirPath, "snapshot.txt");
      const testPath = join(tempDirPath, "test.mjs");
      const snapshotAssertionPath = fileURLToPath(
        new URL("./assertSnapshot.mjs", import.meta.url)
      );

      await Promise.all([
        fs.promises.writeFile(snapshotFilePath, "a"),
        fs.promises.writeFile(
          testPath,
          `import assertSnapshot from "${snapshotAssertionPath}";

assertSnapshot("b", "${snapshotFilePath}");
`
        ),
      ]);

      await execFilePromise("node", [testPath], {
        env: {
          ...process.env,
          SAVE_SNAPSHOTS: "1",
        },
      });

      strictEqual(await fs.promises.readFile(snapshotFilePath, "utf8"), "b");
    });
  }
);

tests.add(
  "`assertSnapshot` with snapshot file path, assertion default, snapshot present.",
  async () => {
    await disposableDirectory(async (tempDirPath) => {
      const snapshotFilePath = join(tempDirPath, "snapshot.txt");

      await fs.promises.writeFile(snapshotFilePath, "a");

      await doesNotReject(assertSnapshot("a", snapshotFilePath));
      await rejects(assertSnapshot("b", snapshotFilePath), {
        code: "ERR_ASSERTION",
      });
    });
  }
);

tests.add(
  "`assertSnapshot` with snapshot file path, assertion custom, snapshot present.",
  async () => {
    await disposableDirectory(async (tempDirPath) => {
      const snapshotFilePath = join(tempDirPath, "snapshot.json");

      await fs.promises.writeFile(snapshotFilePath, "a");

      const errorMessage = "Different values.";

      /**
       * Asserts one value is another.
       * @param {unknown} actual Actual value.
       * @param {unknown} expected Expected value.
       * @ignore
       */
      function assertIs(actual, expected) {
        if (!Object.is(actual, expected)) throw new Error(errorMessage);
      }

      await doesNotReject(assertSnapshot("a", snapshotFilePath, assertIs));
      await rejects(
        assertSnapshot("b", snapshotFilePath, assertIs),
        new Error(errorMessage)
      );
    });
  }
);

tests.run();
