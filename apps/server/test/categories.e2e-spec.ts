import type { INestApplication } from "@nestjs/common";
import { Client } from "pg";
import request from "supertest";
import { loadConfig, sslFor } from "../src/config";
import { createApp } from "../src/create-app";
import { migrate } from "../src/migrate";
import { seed } from "../src/seed";

describe("GET /api/categories", () => {
  let app: INestApplication | undefined;

  beforeAll(async () => {
    const { databaseUrl } = loadConfig();
    await migrate(databaseUrl);
    await seed(databaseUrl);
    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it("returns the seeded games and movies categories", async () => {
    if (!app) {
      throw new Error("Nest app failed to start");
    }

    const response = await request(app.getHttpServer()).get("/api/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { slug: "games", name: "Games", activityCount: 25 },
      { slug: "movies", name: "Movies", activityCount: 25 },
    ]);
  });
});

describe("seed", () => {
  it("leaves the same categories when run twice", async () => {
    const { databaseUrl } = loadConfig();
    await migrate(databaseUrl);

    await seed(databaseUrl);
    await seed(databaseUrl);

    const client = new Client({
      connectionString: databaseUrl,
      ssl: sslFor(databaseUrl),
    });
    await client.connect();
    try {
      const result = await client.query<{
        slug: string;
        name: string;
        activity_count: number;
      }>("SELECT slug, name, activity_count FROM categories ORDER BY slug");
      expect(result.rows).toEqual([
        { slug: "games", name: "Games", activity_count: 25 },
        { slug: "movies", name: "Movies", activity_count: 25 },
      ]);
    } finally {
      await client.end();
    }
  });
});
