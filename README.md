# Ganzu

Load configuration from multiple sources, with support for predefined environments.

## Packages

This is a monorepo. See the individual packages for usage information and documentation:

- [ganzu](https://github.com/mythmon/ganzu/tree/main/pkgs/ganzu#readme) for the main package
- [ganzu-json](https://github.com/mythmon/ganzu/tree/main/pkgs/json#readme) for JSON configuration
- [ganzu-yaml](https://github.com/mythmon/ganzu/tree/main/pkgs/yaml#readme) for YAML configuration

## Development

```sh
# Install dependencies
$ npm install
# Run all checks
$ npm run dev
```

There are a few scripts defined in `package.json` that operate on all packages:

- `npm run build` - Bundle and transpile to JS
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix any auto-fixable issues
- `npm run format` - Run Prettier and fix any auto-fixable issues
- `npm run format:check` - Run Prettier, but don't change any files

Additionally, there is a combination of all of these: `npm run dev`, which could be used as the basis of a pre-commit hook.

For more fine-grained tasks, you can change into the individual package you're working on, or use turbo to filter tasks. For example:

```sh
# Run tests in the ganzu package
$ npx turbo run test --filter=ganzu

# Run lint in the json package
$ npx turbo run lint --filter=@ganzu/json
```

Using turbo this way will also run any dependencies of the package, such as building the ganzu when testing ganzu-json.

## Inspiration

Ganzu is inspired by [django-configurations](https://django-configurations.readthedocs.io/en/stable/) and [zod-config](https://github.com/alexmarqs/zod-config).

## Name

The word "ganzu" is a Lojban word whose [full English definition][defn] is:

> `x1` organizes `x2` [relative chaos] into `x3` [ordered/organized result] by system/principle(s) `x4`

Depending on how it is used, this can be used to refer to the organizer, the thing being organized, the result, or the system of organization. The simplest translation is something like "organizer" or "to organize".

[defn]: https://la-lojban.github.io/sutysisku/lojban/#seskari=cnano&sisku=ganzu&bangu=en&versio=masno
