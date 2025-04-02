# ganzu-yaml

Loads configuration values from YAML files or YAML strings for [ganzu](https://npmjs.com/package/ganzu).

```ts
import { g, loadConfig } from 'ganzu';
import { YamlSource } from 'ganzu-yaml';

const Config = {
  color: g.string(),
  speed: g.string().default('fast'),
}

const sources = [new YamlSource('config.yaml')];

const config = await loadConfig(Config, sources);
```
