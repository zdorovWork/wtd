import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundlePath = path.join(root, "dist/server.js");

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "cjs",
  outfile: "dist/server.js",
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

if (process.env.VERCEL) {
  await copyFile(bundlePath, path.join(root, "src/server.js"));
}
