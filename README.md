# Ganzu

Load configuration from multiple sources, with support for predefined environments.

## Usage

When using Ganzu, you define the configuration that you want to load, and separately define the sources that it should come from. By splitting this up, it allows you to use different loading strategies in different environments, such as using fixed values in staging, generated values in development, and environment variables in production.

To define a configuration, make a plain JS object that uses `g` to define each field:

```ts
import { g } from 'ganzu';

const Config = {
  port: g.number(),
  databaseUrl: g.string(),
};
```

Then define your sources:

```ts
import { EnvSource } from 'ganzu';

const sources = [new EnvSource()];
```

and finally load the configuration:

```ts
import { loadConfig } from 'ganzu';

const config = await load(Config, sources);
```

The result will be a plain JS object with the same structure as the definition, but with the values filled in from the sources. Ganzu provides automatic type inference for the configuration object, so the types of the fields will be inferred from the definition.

To get a concrete version of the type, you can use `Infer`:

```ts
import { Infer } from 'ganzu';

const Config = { /* ... */ };
type Config = Infer<typeof Config>;
```

## Development

```sh
$ npm install
$ npm run test
```

Tests are written using [Vitest](https://vitest.dev/), and include type-level tests.

## Inspiration

Ganzu is inspired by [django-configurations](https://django-configurations.readthedocs.io/en/stable/).

## Name

The word "ganzu" is a Lojban word who's [full English definition][defn] is:

> `x1` organizes `x2` [relative chaos] into `x3` [ordered/organized result] by system/principle(s) `x4`

Depending on how it is used, this can be used to refer to the organizer, the thing being organized, the result, or the system of organization. The simplest translation is something like "organizer" or "to organize".

[defn]: https://la-lojban.github.io/sutysisku/lojban/#seskari=cnano&sisku=ganzu&bangu=en&versio=masno
