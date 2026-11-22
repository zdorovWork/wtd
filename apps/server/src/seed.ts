import { Client } from "pg";
import { gameQuestions } from "./catalogue/game-questions";
import { gameTags } from "./catalogue/game-tags";
import { games } from "./catalogue/games";
import { movieQuestions } from "./catalogue/movie-questions";
import { movieTags } from "./catalogue/movie-tags";
import { movies } from "./catalogue/movies";
import { syncGamesActivityCount } from "./categories/games/sync-games-activity-count";
import { syncMoviesActivityCount } from "./categories/movies/sync-movies-activity-count";
import { loadConfig, sslFor } from "./config";
import type { Game, Movie, Question, Tag } from "./types";

type TagTable = "games_tags" | "movies_tags";
type QuestionTable = "games_questions" | "movies_questions";

const upsertTags = async (
  client: Client,
  table: TagTable,
  tags: Tag[],
): Promise<void> => {
  for (const tag of tags) {
    await client.query(
      `
        INSERT INTO ${table} (id, label)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label
      `,
      [tag.id, tag.label],
    );
  }
};

const deleteRemovedTags = async (
  client: Client,
  table: TagTable,
  tags: Tag[],
): Promise<void> => {
  await client.query(
    `
      DELETE FROM ${table}
      WHERE NOT (id = ANY($1::text[]))
    `,
    [tags.map((tag) => tag.id)],
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

  await client.query("DELETE FROM games_tag_links WHERE game_slug = $1", [
    game.slug,
  ]);

  for (const tagId of game.tags) {
    await client.query(
      `
        INSERT INTO games_tag_links (game_slug, tag_id)
        VALUES ($1, $2)
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

  await client.query("DELETE FROM movies_tag_links WHERE movie_slug = $1", [
    movie.slug,
  ]);

  for (const tagId of movie.tags) {
    await client.query(
      `
        INSERT INTO movies_tag_links (movie_slug, tag_id)
        VALUES ($1, $2)
      `,
      [movie.slug, tagId],
    );
  }
};

const replaceQuestions = async (
  client: Client,
  table: QuestionTable,
  questions: Question[],
): Promise<void> => {
  await client.query(`DELETE FROM ${table}`);

  for (const [position, question] of questions.entries()) {
    await client.query(
      `
        INSERT INTO ${table} (id, tag_id, text, position)
        VALUES ($1, $2, $3, $4)
      `,
      [question.id, question.tagId, question.text, position],
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

    await upsertTags(client, "games_tags", gameTags);
    await upsertTags(client, "movies_tags", movieTags);

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

    await replaceQuestions(client, "games_questions", gameQuestions);
    await replaceQuestions(client, "movies_questions", movieQuestions);

    await deleteRemovedTags(client, "games_tags", gameTags);
    await deleteRemovedTags(client, "movies_tags", movieTags);

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
