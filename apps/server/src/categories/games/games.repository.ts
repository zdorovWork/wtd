import { Inject, Injectable } from "@nestjs/common";
import { PostgresService } from "../../postgres";
import type { Game } from "../../types";

type GameRow = {
  slug: string;
  title: string;
  description: string;
  year: number;
  genres: string[];
  platforms: string[];
  play_modes: string[];
  tags: string[];
};

const gameSelect = `
  SELECT
    g.slug,
    g.title,
    g.description,
    g.year,
    g.genres,
    g.platforms,
    g.play_modes,
    COALESCE(
      (
        SELECT array_agg(gt.tag_id ORDER BY gt.tag_id)
        FROM games_tags gt
        WHERE gt.game_slug = g.slug
      ),
      '{}'
    ) AS tags
  FROM games g
`;

const toGame = (row: GameRow): Game => ({
  category: "games",
  slug: row.slug,
  title: row.title,
  description: row.description,
  year: row.year,
  genres: row.genres,
  platforms: row.platforms,
  playModes: row.play_modes,
  tags: row.tags,
});

@Injectable()
export class GamesRepository {
  constructor(
    @Inject(PostgresService) private readonly postgres: PostgresService,
  ) {}

  async list(): Promise<Game[]> {
    const result = await this.postgres.pool.query<GameRow>(
      `${gameSelect} ORDER BY g.slug`,
    );

    return result.rows.map(toGame);
  }

  async findBySlug(slug: string): Promise<Game | null> {
    const result = await this.postgres.pool.query<GameRow>(
      `${gameSelect} WHERE g.slug = $1`,
      [slug],
    );
    const row = result.rows[0];

    return row ? toGame(row) : null;
  }
}
