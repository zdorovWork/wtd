import assert from "node:assert/strict";
import { test } from "node:test";
import { getGame, getGameTraits, listGameSlugs } from "./games.ts";
import type { Game } from "./types.ts";

const getAllGames = async (): Promise<Game[]> => {
  const slugs = await listGameSlugs();
  const games = await Promise.all(slugs.map((slug) => getGame(slug)));

  return games.filter((game) => game !== null);
};

test("getGame returns null for an unknown slug", async () => {
  assert.equal(await getGame("no-such-game"), null);
});

test("listGameSlugs returns unique slugs", async () => {
  const slugs = await listGameSlugs();

  assert.ok(slugs.length > 0);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every listed slug resolves to a game in the games category", async () => {
  const slugs = await listGameSlugs();

  for (const slug of slugs) {
    const game = await getGame(slug);
    assert.equal(game?.slug, slug);
    assert.equal(game?.category, "games");
  }
});

test("every trait mark references an existing games trait", async () => {
  const traitIds = new Set((await getGameTraits()).map((trait) => trait.id));

  for (const game of await getAllGames()) {
    for (const traitId of Object.keys(game.traitMarks)) {
      assert.ok(traitIds.has(traitId), `${game.slug} marks "${traitId}"`);
    }
  }
});

test("every games trait has at least one yes and one no game", async () => {
  const games = await getAllGames();

  for (const trait of await getGameTraits()) {
    const marks = games.map((game) => game.traitMarks[trait.id]);
    assert.ok(marks.includes("yes"), `no game marks "${trait.id}" yes`);
    assert.ok(marks.includes("no"), `no game marks "${trait.id}" no`);
  }
});
