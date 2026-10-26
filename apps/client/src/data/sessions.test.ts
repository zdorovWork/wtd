import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { listGameSlugs } from "./games.ts";
import { listMovieSlugs } from "./movies.ts";
import { getSessionData } from "./sessions.ts";
import type { CategorySlug } from "./types.ts";

const categorySlugs: CategorySlug[] = ["games", "movies"];

const listSlugsByCategory: Record<CategorySlug, () => Promise<string[]>> = {
  games: listGameSlugs,
  movies: listMovieSlugs,
};

const getSession = async (category: CategorySlug) => {
  const session = await getSessionData(category);
  assert.ok(session);

  return session;
};

describe("getSessionData", () => {
  test("an unknown category yields not-found", async () => {
    assert.equal(await getSessionData("books"), null);
  });

  for (const category of categorySlugs) {
    test(`the ${category} session holds every ${category} activity`, async () => {
      const session = await getSession(category);

      assert.equal(session.category, category);
      assert.deepEqual(
        session.activities.map((activity) => activity.slug),
        await listSlugsByCategory[category](),
      );
      for (const activity of session.activities) {
        assert.equal(activity.category, category, activity.slug);
      }
    });
  }
});

for (const category of categorySlugs) {
  describe(`${category} questions integrity`, () => {
    test("there are 15 to 20 questions", async () => {
      const { questions } = await getSession(category);

      assert.ok(questions.length >= 15 && questions.length <= 20);
    });

    test("question ids are unique", async () => {
      const { questions } = await getSession(category);
      const ids = questions.map((question) => question.id);

      assert.equal(new Set(ids).size, ids.length);
    });

    test("every question references an existing trait of its own category", async () => {
      const { questions, traits } = await getSession(category);
      const traitIds = new Set(traits.map((trait) => trait.id));

      for (const question of questions) {
        assert.equal(question.category, category, question.id);
        assert.ok(traitIds.has(question.traitId), question.id);
      }
    });
  });
}

describe("session isolation between categories", () => {
  test("no question id is shared between categories", async () => {
    const games = await getSession("games");
    const movies = await getSession("movies");
    const gameQuestionIds = new Set(games.questions.map(({ id }) => id));

    for (const question of movies.questions) {
      assert.ok(!gameQuestionIds.has(question.id), question.id);
    }
  });
});
