import { Inject, Injectable } from "@nestjs/common";
import { PostgresService } from "../../postgres";
import type { Movie } from "../../types";

type MovieRow = {
  slug: string;
  title: string;
  description: string;
  year: number;
  genres: string[];
  runtime_minutes: number;
  director: string;
  tags: string[];
};

const movieSelect = `
  SELECT
    m.slug,
    m.title,
    m.description,
    m.year,
    m.genres,
    m.runtime_minutes,
    m.director,
    COALESCE(
      (
        SELECT array_agg(mt.tag_id ORDER BY mt.tag_id)
        FROM movies_tags mt
        WHERE mt.movie_slug = m.slug
      ),
      '{}'
    ) AS tags
  FROM movies m
`;

const toMovie = (row: MovieRow): Movie => ({
  category: "movies",
  slug: row.slug,
  title: row.title,
  description: row.description,
  year: row.year,
  genres: row.genres,
  runtimeMinutes: row.runtime_minutes,
  director: row.director,
  tags: row.tags,
});

@Injectable()
export class MoviesRepository {
  constructor(
    @Inject(PostgresService) private readonly postgres: PostgresService,
  ) {}

  async list(): Promise<Movie[]> {
    const result = await this.postgres.pool.query<MovieRow>(
      `${movieSelect} ORDER BY m.slug`,
    );

    return result.rows.map(toMovie);
  }

  async findBySlug(slug: string): Promise<Movie | null> {
    const result = await this.postgres.pool.query<MovieRow>(
      `${movieSelect} WHERE m.slug = $1`,
      [slug],
    );
    const row = result.rows[0];

    return row ? toMovie(row) : null;
  }
}
