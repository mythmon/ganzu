import { g, loadConfig, EnvSource } from "ganzu";
import { JsonSource } from "ganzu-json";

const Config = {
  appName: g.string().default("My App"),
  port: g.number(),
};

const sources = [
  await JsonSource.fromFile("./config.yml"),
];

const config = loadConfig(Config, sources);

console.log(`Loaded configuration:\n${JSON.stringify(config, null, 2)}`);
