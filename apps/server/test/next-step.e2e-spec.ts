import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { loadConfig } from "../src/config";
import { createApp } from "../src/create-app";
import { migrate } from "../src/migrate";
import { seed } from "../src/seed";
import type { NextStepResponse } from "../src/session/present-next-step";
import type { Activity } from "../src/types";

describe("POST /api/:category/next-step", () => {
  let app: INestApplication | undefined;

  beforeAll(async () => {
    const { databaseUrl } = loadConfig();
    await migrate(databaseUrl);
    await seed(databaseUrl);
    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  const http = () => {
    if (!app) {
      throw new Error("Nest app failed to start");
    }

    return request(app.getHttpServer());
  };

  const postNextStep = (category: string, body: Record<string, unknown>) =>
    http().post(`/api/${category}/next-step`).send(body);

  it("returns the same first games question the client engine picks today", async () => {
    const response = await postNextStep("games", { answers: [] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      kind: "question",
      question: {
        id: "fantasy",
        text: "Do you want a fantasy setting with magic or mythical creatures?",
      },
      answeredCount: 0,
    });
  });

  it("returns the same first movies question the client engine picks today", async () => {
    const response = await postNextStep("movies", { answers: [] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      kind: "question",
      question: {
        id: "dark-tone",
        text: "Are you in the mood for something dark and serious?",
      },
      answeredCount: 0,
    });
  });

  it("walks a games session to a recommendation, then keeps asking after a rejection", async () => {
    const answers: { questionId: string; answer: "yes" | "no" }[] = [];
    let rejectedAtCount: number | undefined;
    let firstRecommendation: Activity[] | undefined;

    for (let stepIndex = 0; stepIndex < 40; stepIndex += 1) {
      const response = await postNextStep("games", {
        answers,
        rejectedAtCount,
      });

      expect(response.status).toBe(200);
      const body = response.body as NextStepResponse;

      if (body.kind === "question") {
        expect(body.question).toEqual({
          id: expect.any(String),
          text: expect.any(String),
        });
        expect(body.answeredCount).toBe(answers.length);
        answers.push({
          questionId: body.question.id,
          answer: rejectedAtCount === undefined ? "yes" : "no",
        });
        continue;
      }

      if (body.kind === "activityWish") {
        expect(rejectedAtCount).toBeDefined();
        expect(firstRecommendation).toBeDefined();
        return;
      }

      expect(body.kind).toBe("recommendation");
      expect(body.activities.length).toBeGreaterThan(0);
      expect(body.activities.length).toBeLessThanOrEqual(5);

      if (rejectedAtCount === undefined) {
        firstRecommendation = body.activities;
        rejectedAtCount = answers.length;
        continue;
      }

      expect(firstRecommendation).toBeDefined();
      expect(answers.length).toBeGreaterThan(rejectedAtCount);
      return;
    }

    throw new Error("session did not reach a recommendation after rejection");
  });

  it("returns 400 when answers is not an array", async () => {
    const response = await postNextStep("games", { answers: "yes" });

    expect(response.status).toBe(400);
  });

  it("returns 400 when an answer value is unknown", async () => {
    const first = await postNextStep("games", { answers: [] });
    const questionId = (first.body as NextStepResponse & { kind: "question" })
      .question.id;

    const response = await postNextStep("games", {
      answers: [{ questionId, answer: "maybe" }],
    });

    expect(response.status).toBe(400);
  });

  it("returns 400 when a question id is unknown", async () => {
    const response = await postNextStep("games", {
      answers: [{ questionId: "no-such-question", answer: "yes" }],
    });

    expect(response.status).toBe(400);
  });

  it("returns 400 when rejectedAtCount is negative", async () => {
    const response = await postNextStep("games", {
      answers: [],
      rejectedAtCount: -1,
    });

    expect(response.status).toBe(400);
  });

  it("returns 400 when rejectedAtCount is fractional", async () => {
    const response = await postNextStep("games", {
      answers: [],
      rejectedAtCount: 1.5,
    });

    expect(response.status).toBe(400);
  });

  it("returns 404 for an unknown category", async () => {
    const response = await postNextStep("books", { answers: [] });

    expect(response.status).toBe(404);
  });
});
