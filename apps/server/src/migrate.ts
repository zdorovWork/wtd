import { spawn } from "node:child_process";
import path from "node:path";
import { loadConfig } from "./config";

const serverRoot = path.join(__dirname, "..");
const migrateBin = path.join(
  serverRoot,
  "node_modules",
  "node-pg-migrate",
  "bin",
  "node-pg-migrate.js",
);

export const migrate = async (databaseUrl: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [migrateBin, "up", "-m", "migrations"],
      {
        cwd: serverRoot,
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: "inherit",
      },
    );

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`node-pg-migrate exited with code ${code}`));
    });
  });
};

const run = async () => {
  const { databaseUrl } = loadConfig();
  await migrate(databaseUrl);
};

if (require.main === module) {
  run().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
