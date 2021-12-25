# snapshot-assertion changelog

## Next

### Major

- Updated Node.js support to `^12.22.0 || ^14.17.0 || >= 16.0.0`.

### Patch

- Updated dev dependencies.
- Added a package `test:jsdoc` script that checks the readme API docs are up to date with the source JSDoc.
- Also run GitHub Actions CI with Node.js v17, and drop v15.

## 3.0.0

### Major

- Updated Node.js support to `^12.20 || >= 14.13`.
- Updated dev dependencies, some of which require newer Node.js versions than were previously supported.
- Added a package `exports` field.
- The API is now ESM in `.mjs` files instead of CJS in `.js` files, [accessible via `import` but not `require`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_require).

### Minor

- Added package `sideEffects` field.

### Patch

- Stop using [`hard-rejection`](https://npm.im/hard-rejection) to detect unhandled `Promise` rejections in tests, as Node.js v15+ does this natively.
- Simplified the package scripts now that [`jsdoc-md`](https://npm.im/jsdoc-md) v10 automatically generates a Prettier formatted readme.
- Updated GitHub Actions CI config:
  - Also run tests with Node.js v16.
  - Updated `actions/checkout` to v2.
  - Updated `actions/setup-node` to v2.
  - Don’t specify the `CI` environment variable as it’s set by default.
- Use `Promise.all` for faster tests.
- Tweak whitespace formatting.
- Readme tweaks.

## 2.0.0

### Major

- Updated Node.js support to `^10.17.0 || ^12.0.0 || >= 13.7.0`.
- Updated dev dependencies, some of which require newer Node.js versions than previously supported.

### Patch

- Ensure GitHub Actions CI runs on pull request.
- Also run GitHub Actions CI with Node.js v14 and v15, and not v13.
- Simplified the GitHub Actions CI config with the [`npm install-test`](https://docs.npmjs.com/cli/v7/commands/npm-install-test) command.
- Improved the package `prepare:prettier` and `test:prettier` scripts.
- Configured Prettier option `semi` to the default, `true`.
- Removed a now redundant ESLint rule config.
- Removed `npm-debug.log` from the `.gitignore` file as npm [v4.2.0](https://github.com/npm/npm/releases/tag/v4.2.0)+ doesn’t create it in the current working directory.
- Use HTTPS in an `.editorconfig` comment URL.
- Use HTTPS in a URL within a `snapshot` function code example.
- Documented how to `import` and `require` the `snapshot` function.

## 1.0.0

Initial release.
