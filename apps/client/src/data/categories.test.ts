import assert from "node:assert/strict";
import { test } from "node:test";
import { getCategories } from "./categories.ts";

test("getCategories returns the games and movies categories", async () => {
  const categories = await getCategories();

  assert.deepEqual(categories, [
    { slug: "games", name: "Games" },
    { slug: "movies", name: "Movies" },
  ]);
});
