import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: "node18",
  sourcemap: true,
  clean: true,
  minify: false,
  dts: true,
});
