import { Inject, Injectable } from "@nestjs/common";
import { PostgresService } from "../postgres";
import type { Category } from "../types";

type CategoryRow = {
  slug: string;
  name: string;
};

@Injectable()
export class CategoriesRepository {
  constructor(
    @Inject(PostgresService) private readonly postgres: PostgresService,
  ) {}

  async list(): Promise<Category[]> {
    const result = await this.postgres.pool.query<CategoryRow>(
      "SELECT slug, name FROM categories ORDER BY slug",
    );

    return result.rows.map((row) => ({
      slug: row.slug,
      name: row.name,
    }));
  }
}
