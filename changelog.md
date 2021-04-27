# snapshot-assertion changelog

## Next

### Major

- Updated Node.js support to `^12.20 || >= 14.13`.

### Patch

- Stop using [`hard-rejection`](https://npm.im/hard-rejection) to detect unhandled `Promise` rejections in tests, as Node.js v15+ does this natively.

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
