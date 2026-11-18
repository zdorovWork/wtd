import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, mock, test } from "node:test";
import { fetchNextStep } from "./next-step.ts";

const witcher = {
  category: "games",
  slug: "the-witcher-3-wild-hunt",
  title: "The Witcher 3: Wild Hunt",
  description: "Geralt searches a war-torn continent.",
  year: 2015,
  genres: ["Action RPG"],
  platforms: ["PC"],
  playModes: ["Single-player"],
  tags: ["storyDriven"],
};

const jsonResponse = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("fetchNextStep", () => {
  const originalServerUrl = process.env.SERVER_URL;

  beforeEach(() => {
    process.env.SERVER_URL = "http://server.test";
  });

  afterEach(() => {
    mock.restoreAll();
    process.env.SERVER_URL = originalServerUrl;
  });

  test("an unknown category yields not-found", async () => {
    mock.method(globalThis, "fetch", async () => jsonResponse(404, {}));

    assert.equal(await fetchNextStep("books", { answers: [] }), null);
  });

  test("posts answers to the category next-step endpoint", async () => {
    const fetchMock = mock.method(globalThis, "fetch", async () =>
      jsonResponse(200, {
        kind: "question",
        question: { id: "games-fantasy", text: "Want fantasy?" },
        answeredCount: 1,
      }),
    );

    await fetchNextStep("games", {
      answers: [{ questionId: "games-co-op", answer: "yes" }],
      rejectedAtCount: 0,
    });

    assert.equal(fetchMock.mock.callCount(), 1);
    const call = fetchMock.mock.calls[0];
    assert.ok(call);
    const [url, init] = call.arguments;
    assert.equal(
      String(url),
      "http://server.test/api/categories/games/next-step",
    );
    assert.equal(init?.method, "POST");
    const headers = init?.headers;
    assert.ok(headers && "Content-Type" in headers);
    assert.equal(headers["Content-Type"], "application/json");
    assert.equal(
      init?.body,
      JSON.stringify({
        answers: [{ questionId: "games-co-op", answer: "yes" }],
        rejectedAtCount: 0,
      }),
    );
  });

  test("returns a question step", async () => {
    mock.method(globalThis, "fetch", async () =>
      jsonResponse(200, {
        kind: "question",
        question: {
          id: "games-fantasy",
          text: "Do you want a fantasy setting with magic or mythical creatures?",
        },
        answeredCount: 0,
      }),
    );

    assert.deepEqual(await fetchNextStep("games", { answers: [] }), {
      kind: "question",
      question: {
        id: "games-fantasy",
        text: "Do you want a fantasy setting with magic or mythical creatures?",
      },
      answeredCount: 0,
    });
  });

  test("returns a recommendation of activities", async () => {
    mock.method(globalThis, "fetch", async () =>
      jsonResponse(200, {
        kind: "recommendation",
        activities: [witcher],
      }),
    );

    assert.deepEqual(await fetchNextStep("games", { answers: [] }), {
      kind: "recommendation",
      activities: [witcher],
    });
  });

  test("a failed request is an error", async () => {
    mock.method(globalThis, "fetch", async () => jsonResponse(500, {}));

    await assert.rejects(
      () => fetchNextStep("games", { answers: [] }),
      /Failed to load next step: 500/,
    );
  });
});
