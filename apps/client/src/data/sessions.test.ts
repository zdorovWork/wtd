import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { listGameSlugs } from "./games.ts";
import { getSessionData } from "./sessions.ts";

const getGamesSession = async () => {
  const session = await getSessionData("games");
  assert.ok(session);

  return session;
};

describe("getSessionData", () => {
  test("an unknown category yields not-found", async () => {
    assert.equal(await getSessionData("books"), null);
  });

  test("movies yield not-found until they have questions", async () => {
    assert.equal(await getSessionData("movies"), null);
  });

  test("the games session holds every game", async () => {
    const session = await getGamesSession();

    assert.equal(session.category, "games");
    assert.deepEqual(
      session.activities.map((activity) => activity.slug),
      await listGameSlugs(),
    );
  });
});

describe("games questions integrity", () => {
  test("there are 15 to 20 questions", async () => {
    const { questions } = await getGamesSession();

    assert.ok(questions.length >= 15 && questions.length <= 20);
  });

  test("question ids are unique", async () => {
    const { questions } = await getGamesSession();
    const ids = questions.map((question) => question.id);

    assert.equal(new Set(ids).size, ids.length);
  });

  test("every question references an existing trait of its own category", async () => {
    const { category, questions, traits } = await getGamesSession();
    const traitIds = new Set(traits.map((trait) => trait.id));

    for (const question of questions) {
      assert.equal(question.category, category, question.id);
      assert.ok(traitIds.has(question.traitId), question.id);
    }
  });
});
