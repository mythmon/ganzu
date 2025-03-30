import { g, loadConfig, EnvSource } from "ganzu";

const Config = {
  appName: g.string().default("My App"),
  port: g.number(),
};

const sources = [
  new EnvSource(),
];

const config = loadConfig(Config, sources);

console.log(`Loaded configuration:\n${JSON.stringify(config, null, 2)}`);
