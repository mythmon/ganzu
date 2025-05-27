import { g, loadConfig, EnvSource } from "ganzu";
import { OnePasswordSource, OnePasswordReference } from "ganzu-1password";
import { createClient } from "@1password/sdk";

const Config = {
  username: g.string().with(new OnePasswordReference("op://ganzu dev/Login/username")),
  password: g.string().with(new OnePasswordReference("op://ganzu dev/Login/password")),
};

const client = await createClient({
  auth: process.env.OP_SERVICE_ACCOUNT_TOKEN,
  integrationName: "Ganzu development example",
  integrationVersion: "v0.0.1",
});

const sources = [new OnePasswordSource(client)];
const config = await loadConfig(Config, sources);

console.log(`Loaded configuration:\n${JSON.stringify(config, null, 2)}`);
