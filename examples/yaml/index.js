import { g, loadConfig, EnvSource } from "ganzu";
import { YamlSource } from "ganzu-yaml";

const Config = {
  appName: g.string().default("My App"),
  port: g.number(),
};

const sources = [
  await YamlSource.fromFile("./config.yml"),
];

const config = loadConfig(Config, sources);

console.log(`Loaded configuration:\n${JSON.stringify(config, null, 2)}`);
