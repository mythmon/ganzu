# ganzu-json

Loads configuration values from JSON files or JSON strings for [ganzu](https://npmjs.com/package/ganzu).

```ts
import { g, loadConfig } from 'ganzu';
import { JsonSource } from 'ganzu-json';

const Config = {
  color: g.string(),
  speed: g.string().default('fast'),
}

const sources = [new JsonSource('config.json')];

const config = await loadConfig(Config, sources);
```
