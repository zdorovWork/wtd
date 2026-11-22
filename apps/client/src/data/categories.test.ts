import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { parseCategories } from "./parse-categories.ts";

describe("parseCategories", () => {
  test("reads slug, name, and activity count for every category the server sends", () => {
    assert.deepEqual(
      parseCategories([
        { slug: "games", name: "Games", activityCount: 25 },
        { slug: "books", name: "Books", activityCount: 3 },
      ]),
      [
        { slug: "games", name: "Games", activityCount: 25 },
        { slug: "books", name: "Books", activityCount: 3 },
      ],
    );
  });

  test("rejects a category without an activity count", () => {
    assert.throws(
      () => parseCategories([{ slug: "games", name: "Games" }]),
      /Invalid category from the server/,
    );
  });
});
