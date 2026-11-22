import type { INestApplication } from "@nestjs/common";
import { Client } from "pg";
import request from "supertest";
import { games } from "../src/catalogue/games";
import { movies } from "../src/catalogue/movies";
import { loadConfig, sslFor } from "../src/config";
import { createApp } from "../src/create-app";
import { migrate } from "../src/migrate";
import { seed } from "../src/seed";
import type { Activity, Tag } from "../src/types";

const expectedGame: Activity = {
  category: "games",
  slug: "the-witcher-3-wild-hunt",
  title: "The Witcher 3: Wild Hunt",
  description:
    "Geralt of Rivia, a monster hunter for hire, searches a war-torn continent for his adopted daughter while the spectral Wild Hunt closes in.",
  year: 2015,
  genres: ["Action RPG"],
  platforms: [
    "PC",
    "PlayStation 4",
    "PlayStation 5",
    "Xbox One",
    "Xbox Series X|S",
    "Nintendo Switch",
  ],
  playModes: ["Single-player"],
  tags: ["fantasy", "openWorld", "storyDriven"],
};

const expectedMovie: Activity = {
  category: "movies",
  slug: "parasite",
  title: "Parasite",
  description:
    "A poor family in Seoul schemes its way, one member at a time, into working for a wealthy household, until a secret in the house upends everything.",
  year: 2019,
  genres: ["Thriller", "Drama", "Dark comedy"],
  runtimeMinutes: 132,
  director: "Bong Joon-ho",
  tags: ["bestPicture", "darkTone", "nonEnglish", "plotTwist"],
};

describe("activity catalogue API", () => {
  let app: INestApplication | undefined;
  let databaseUrl: string;

  beforeAll(async () => {
    ({ databaseUrl } = loadConfig());
    await migrate(databaseUrl);
    await seed(databaseUrl);
    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  const http = () => {
    if (!app) {
      throw new Error("Nest app failed to start");
    }

    return request(app.getHttpServer());
  };

  it("every seeded game slug resolves to a games activity", async () => {
    for (const game of games) {
      const response = await http().get(`/api/games/activities/${game.slug}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        category: "games",
        slug: game.slug,
      });
    }
  });

  it("every seeded movie slug resolves to a movies activity", async () => {
    for (const movie of movies) {
      const response = await http().get(`/api/movies/activities/${movie.slug}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        category: "movies",
        slug: movie.slug,
      });
    }
  });

  it("returns a game by slug with the same content as the former catalogue", async () => {
    const response = await http().get(
      "/api/games/activities/the-witcher-3-wild-hunt",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedGame);
  });

  it("returns a movie by slug with the same content as the former catalogue", async () => {
    const response = await http().get("/api/movies/activities/parasite");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedMovie);
  });

  it("returns 404 for an unknown game slug", async () => {
    const response = await http().get("/api/games/activities/no-such-activity");

    expect(response.status).toBe(404);
  });

  it("returns 404 for an unknown movie slug", async () => {
    const response = await http().get(
      "/api/movies/activities/no-such-activity",
    );

    expect(response.status).toBe(404);
  });
});

describe("seeded catalogue integrity", () => {
  let databaseUrl: string;

  beforeAll(async () => {
    ({ databaseUrl } = loadConfig());
    await migrate(databaseUrl);
    await seed(databaseUrl);
  });

  const connect = async () => {
    const client = new Client({
      connectionString: databaseUrl,
      ssl: sslFor(databaseUrl),
    });
    await client.connect();
    return client;
  };

  const loadCatalogue = async (category: "games" | "movies") => {
    const client = await connect();
    try {
      const tagTable = category === "games" ? "games_tags" : "movies_tags";
      const tags = await client.query<Tag>(
        `SELECT id, label FROM ${tagTable} ORDER BY id`,
      );
      const activitySql =
        category === "games"
          ? `
              SELECT
                a.slug,
                COALESCE(
                  (
                    SELECT array_agg(j.tag_id ORDER BY j.tag_id)
                    FROM games_tag_links j
                    WHERE j.game_slug = a.slug
                  ),
                  '{}'
                ) AS tags
              FROM games a
            `
          : `
              SELECT
                a.slug,
                COALESCE(
                  (
                    SELECT array_agg(j.tag_id ORDER BY j.tag_id)
                    FROM movies_tag_links j
                    WHERE j.movie_slug = a.slug
                  ),
                  '{}'
                ) AS tags
              FROM movies a
            `;
      const activities = await client.query<{
        slug: string;
        tags: string[];
      }>(activitySql);

      return { tags: tags.rows, activities: activities.rows };
    } finally {
      await client.end();
    }
  };

  for (const category of ["games", "movies"] as const) {
    it(`every ${category} activity tag references an existing ${category} tag, once`, async () => {
      const { tags, activities } = await loadCatalogue(category);
      const tagIds = new Set(tags.map((tag) => tag.id));

      expect(activities.length).toBeGreaterThan(0);

      for (const activity of activities) {
        expect(new Set(activity.tags).size).toBe(activity.tags.length);
        for (const tagId of activity.tags) {
          expect(tagIds.has(tagId)).toBe(true);
        }
      }
    });

    it(`every ${category} tag is held by some activities but not all`, async () => {
      const { tags, activities } = await loadCatalogue(category);

      for (const tag of tags) {
        const holders = activities.filter((activity) =>
          activity.tags.includes(tag.id),
        );
        expect(holders.length).toBeGreaterThan(0);
        expect(holders.length).toBeLessThan(activities.length);
      }
    });
  }
});

describe("catalogue foreign keys", () => {
  let databaseUrl: string;

  beforeAll(async () => {
    ({ databaseUrl } = loadConfig());
    await migrate(databaseUrl);
    await seed(databaseUrl);
  });

  const connect = async () => {
    const client = new Client({
      connectionString: databaseUrl,
      ssl: sslFor(databaseUrl),
    });
    await client.connect();
    return client;
  };

  it("rejects a game tag link to a movies tag", async () => {
    const client = await connect();
    try {
      await expect(
        client.query(
          `
            INSERT INTO games_tag_links (game_slug, tag_id)
            VALUES ('hades', 'bestPicture')
          `,
        ),
      ).rejects.toMatchObject({ code: "23503" });
    } finally {
      await client.end();
    }
  });

  it("rejects a game tag link to a missing tag", async () => {
    const client = await connect();
    try {
      await expect(
        client.query(
          `
            INSERT INTO games_tag_links (game_slug, tag_id)
            VALUES ('hades', 'no-such-tag')
          `,
        ),
      ).rejects.toMatchObject({ code: "23503" });
    } finally {
      await client.end();
    }
  });
});
