# snapshot-assertion changelog

## Next

### Major

- Updated Node.js support to `^10.17.0 || ^12.0.0 || >= 13.7.0`.
- Updated dev dependencies, some of which require newer Node.js versions than previously supported.

### Patch

- Improved the package `prepare:prettier` and `test:prettier` scripts.
- Configured Prettier option `semi` to the default, `true`.
- Removed a now redundant ESLint rule config.
- Removed `npm-debug.log` from the `.gitignore` file as npm [v4.2.0](https://github.com/npm/npm/releases/tag/v4.2.0)+ doesn’t create it in the current working directory.
- Use HTTPS in an `.editorconfig` comment URL.

## 1.0.0

Initial release.
