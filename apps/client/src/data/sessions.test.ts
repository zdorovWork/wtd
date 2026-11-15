import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { gameQuestions } from "../mocks/game-questions.ts";
import { movieQuestions } from "../mocks/movie-questions.ts";
import { getSessionData } from "./sessions.ts";
import type { CategorySlug, Question } from "./types.ts";

const questionsByCategory: Record<CategorySlug, Question[]> = {
  games: gameQuestions,
  movies: movieQuestions,
};

describe("getSessionData", () => {
  test("an unknown category yields not-found", async () => {
    assert.equal(await getSessionData("books"), null);
  });
});

for (const category of Object.keys(questionsByCategory) as CategorySlug[]) {
  describe(`${category} questions integrity`, () => {
    test("there are 15 to 20 questions", () => {
      const { length } = questionsByCategory[category];

      assert.ok(length >= 15 && length <= 20);
    });

    test("question ids are unique", () => {
      const ids = questionsByCategory[category].map((question) => question.id);

      assert.equal(new Set(ids).size, ids.length);
    });

    test("every question belongs to its category and names a tag", () => {
      for (const question of questionsByCategory[category]) {
        assert.equal(question.category, category, question.id);
        assert.ok(question.tagId.length > 0, question.id);
      }
    });
  });
}

describe("session isolation between categories", () => {
  test("no question id is shared between categories", () => {
    const gameQuestionIds = new Set(gameQuestions.map(({ id }) => id));

    for (const question of movieQuestions) {
      assert.ok(!gameQuestionIds.has(question.id), question.id);
    }
  });
});
