# Ganzu

Load configuration from multiple sources, with support for predefined environments.

## Usage

When using Ganzu, you define the configuration that you want to load, and separately define the sources that it should come from. By splitting this up, it allows you to use different loading strategies in different environments, such as using fixed values in testing, generated values in development, and environment variables in production.

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

### Field configuration

Configurations are made up of several _fields_, each of which can be configured
in several ways. Fields are required by default.

- `.default()` sets a default value for a field if one isn't found in any source.
- `.constant()` sets a value for a field that will not be overridden by any source.
- `.optional()` is an alias for `.default(null)`, and the type of the field must allow null.
- `.alias()` provides an extra name that will be used when searching for values in a source. It may be repeated.

Fields are immutable, so calling these methods returns a new instance with the change applied, leaving the original unmodified. That also means these methods are chainable.

### Configuration Environments

Since the configuration objects are plain JS objects, they can be manipulated at runtime, and specifically you can define multiple configurations, and choose one dynamically based on where your code is running.

For example, consider a service that needs to load a value from an S3 bucket. In production the name of the bucket to use comes from an environment variable. In development however, everyone will use the same mock bucket name. Configuring this as an environment variable for each developer can be tedious, especially if new values are introduced.

To handle this situation, define two configurations. The second definition should build off the first using the spread operator (`...`) and customize each field as needed. Because fields are immutable, configuring them won't affect the base configuration.

```ts
const BaseConfig = {
  port: g.number(),
  bucketName: g.string(),
}

const DevConfig = {
  ...BaseConfig,
  bucketName: BaseConfig.bucketName.default("mock-bucket"),
};
```

Now, when you load your configuration, you can choose which of these values to use.

```js
const template = shouldUseDev() ? DevConfig : BaseConfig;
const config = loadConfig(template, sources);
```

In this way, you can adapt your configuration system to each environment without having to give up flexibility.

## Sources

Besides `EnvSource`, this package also provides `FixedSource`, which loads its values from a JS object. It's primarily useful in tests.

Other sources can be defined by implementing the `Source` interface. See [`ganzu-json`][json-src] and [`ganzu-yaml`][yaml-src] for examples on how to do that.

[json-src]: https://github.com/mythmon/ganzu/blob/main/pkgs/json/src/index.ts
[yaml-src]: https://github.com/mythmon/ganzu/blob/main/pkgs/yaml/src/index.ts

To find more sources, see the [`ganzu-source` tag on NPM](https://www.npmjs.com/search?q=keywords:ganzu).
