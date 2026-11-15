import { Inject, Injectable } from "@nestjs/common";
import { PostgresService } from "../postgres";
import type { Question } from "../types";

type QuestionRow = {
  id: string;
  category: "games" | "movies";
  tag: string;
  text: string;
};

const toQuestion = (row: QuestionRow): Question => ({
  id: row.id,
  category: row.category,
  tagId: row.tag,
  text: row.text,
});

@Injectable()
export class QuestionsRepository {
  constructor(
    @Inject(PostgresService) private readonly postgres: PostgresService,
  ) {}

  async listByCategory(category: string): Promise<Question[]> {
    const result = await this.postgres.pool.query<QuestionRow>(
      `
        SELECT id, category, tag, text
        FROM questions
        WHERE category = $1
        ORDER BY position
      `,
      [category],
    );

    return result.rows.map(toQuestion);
  }
}
