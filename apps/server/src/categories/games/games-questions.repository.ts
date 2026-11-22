import { Inject, Injectable } from "@nestjs/common";
import { PostgresService } from "../../postgres";
import type { Question } from "../../types";

type QuestionRow = {
  id: string;
  tag_id: string;
  text: string;
};

const toQuestion = (row: QuestionRow): Question => ({
  id: row.id,
  tagId: row.tag_id,
  text: row.text,
});

@Injectable()
export class GamesQuestionsRepository {
  constructor(
    @Inject(PostgresService) private readonly postgres: PostgresService,
  ) {}

  async list(): Promise<Question[]> {
    const result = await this.postgres.pool.query<QuestionRow>(
      `
        SELECT id, tag_id, text
        FROM games_questions
        ORDER BY position
      `,
    );

    return result.rows.map(toQuestion);
  }
}
