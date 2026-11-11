import { Client } from "pg";
import { loadConfig, sslFor } from "./config";

export const seed = async (databaseUrl: string): Promise<void> => {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: sslFor(databaseUrl),
  });

  await client.connect();
  try {
    await client.query(`
      INSERT INTO categories (slug, name)
      VALUES
        ('games', 'Games'),
        ('movies', 'Movies')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    `);
  } finally {
    await client.end();
  }
};

const run = async () => {
  const { databaseUrl } = loadConfig();
  await seed(databaseUrl);
};

if (require.main === module) {
  run().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
