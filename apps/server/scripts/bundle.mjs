import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "cjs",
  outfile: "src/server.js",
  keepNames: true,
  packages: "bundle",
  external: [
    "pg-native",
    "@nestjs/microservices",
    "@nestjs/microservices/microservices-module",
    "@nestjs/websockets",
    "@nestjs/websockets/socket-module",
    "class-transformer",
    "class-validator",
  ],
});
