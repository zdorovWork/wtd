import { Client } from "pg";
import { syncGamesActivityCount } from "./activities/sync-games-activity-count";
import { syncMoviesActivityCount } from "./activities/sync-movies-activity-count";
import { gameQuestions } from "./catalogue/game-questions";
import { gameTags } from "./catalogue/game-tags";
import { games } from "./catalogue/games";
import { movieQuestions } from "./catalogue/movie-questions";
import { movieTags } from "./catalogue/movie-tags";
import { movies } from "./catalogue/movies";
import { loadConfig, sslFor } from "./config";
import type { Game, Movie, Question, Tag } from "./types";

const upsertTags = async (
  client: Client,
  category: "games" | "movies",
  tags: Tag[],
): Promise<void> => {
  for (const tag of tags) {
    await client.query(
      `
        INSERT INTO tags (category, id, label)
        VALUES ($1, $2, $3)
        ON CONFLICT (category, id) DO UPDATE SET label = EXCLUDED.label
      `,
      [category, tag.id, tag.label],
    );
  }
};

const deleteRemovedTags = async (
  client: Client,
  category: "games" | "movies",
  tags: Tag[],
): Promise<void> => {
  await client.query(
    `
      DELETE FROM tags
      WHERE category = $1
        AND NOT (id = ANY($2::text[]))
    `,
    [category, tags.map((tag) => tag.id)],
  );
};

const upsertGame = async (client: Client, game: Game): Promise<void> => {
  await client.query(
    `
      INSERT INTO games (slug, title, description, year, genres, platforms, play_modes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        year = EXCLUDED.year,
        genres = EXCLUDED.genres,
        platforms = EXCLUDED.platforms,
        play_modes = EXCLUDED.play_modes
    `,
    [
      game.slug,
      game.title,
      game.description,
      game.year,
      game.genres,
      game.platforms,
      game.playModes,
    ],
  );

  await client.query("DELETE FROM games_tags WHERE game_slug = $1", [
    game.slug,
  ]);

  for (const tagId of game.tags) {
    await client.query(
      `
        INSERT INTO games_tags (game_slug, tag_category, tag_id)
        VALUES ($1, 'games', $2)
      `,
      [game.slug, tagId],
    );
  }
};

const upsertMovie = async (client: Client, movie: Movie): Promise<void> => {
  await client.query(
    `
      INSERT INTO movies (slug, title, description, year, genres, runtime_minutes, director)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        year = EXCLUDED.year,
        genres = EXCLUDED.genres,
        runtime_minutes = EXCLUDED.runtime_minutes,
        director = EXCLUDED.director
    `,
    [
      movie.slug,
      movie.title,
      movie.description,
      movie.year,
      movie.genres,
      movie.runtimeMinutes,
      movie.director,
    ],
  );

  await client.query("DELETE FROM movies_tags WHERE movie_slug = $1", [
    movie.slug,
  ]);

  for (const tagId of movie.tags) {
    await client.query(
      `
        INSERT INTO movies_tags (movie_slug, tag_category, tag_id)
        VALUES ($1, 'movies', $2)
      `,
      [movie.slug, tagId],
    );
  }
};

const replaceQuestions = async (
  client: Client,
  category: "games" | "movies",
  questions: Question[],
): Promise<void> => {
  await client.query("DELETE FROM questions WHERE category = $1", [category]);

  for (const [position, question] of questions.entries()) {
    await client.query(
      `
        INSERT INTO questions (id, category, tag, text, position)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [question.id, question.category, question.tagId, question.text, position],
    );
  }
};

export const seed = async (databaseUrl: string): Promise<void> => {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: sslFor(databaseUrl),
  });

  await client.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      INSERT INTO categories (slug, name)
      VALUES
        ('games', 'Games'),
        ('movies', 'Movies')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    `);

    await upsertTags(client, "games", gameTags);
    await upsertTags(client, "movies", movieTags);

    for (const game of games) {
      await upsertGame(client, game);
    }
    await client.query("DELETE FROM games WHERE NOT (slug = ANY($1::text[]))", [
      games.map((game) => game.slug),
    ]);

    for (const movie of movies) {
      await upsertMovie(client, movie);
    }
    await client.query(
      "DELETE FROM movies WHERE NOT (slug = ANY($1::text[]))",
      [movies.map((movie) => movie.slug)],
    );

    await replaceQuestions(client, "games", gameQuestions);
    await replaceQuestions(client, "movies", movieQuestions);

    await deleteRemovedTags(client, "games", gameTags);
    await deleteRemovedTags(client, "movies", movieTags);

    await syncGamesActivityCount(client);
    await syncMoviesActivityCount(client);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
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
