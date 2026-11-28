import { parseGame, parseMovie } from "./parse-activity.ts";
import type { Activity, NextStep, NextStepRequest } from "./types.ts";

const readServerUrl = (): string => {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    throw new Error("SERVER_URL is missing");
  }

  return serverUrl;
};

const nextStepUrl = (category: string): string => {
  const path = `/api/${encodeURIComponent(category)}/next-step`;
  if (typeof window !== "undefined") {
    return path;
  }

  return new URL(path, readServerUrl()).toString();
};

const parseSessionQuestion = (value: unknown): { id: string; text: string } => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("text" in value) ||
    typeof value.id !== "string" ||
    typeof value.text !== "string"
  ) {
    throw new Error("Invalid question from the server");
  }

  return { id: value.id, text: value.text };
};

const parseActivity = (value: unknown): Activity => {
  if (typeof value !== "object" || value === null || !("category" in value)) {
    throw new Error("Invalid activity from the server");
  }

  if (value.category === "games") {
    return parseGame(value);
  }

  if (value.category === "movies") {
    return parseMovie(value);
  }

  throw new Error("Invalid activity from the server");
};

const parseNextStep = (value: unknown): NextStep => {
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    throw new Error("Invalid next step from the server");
  }

  if (value.kind === "question") {
    if (!("question" in value) || !("answeredCount" in value)) {
      throw new Error("Invalid next step from the server");
    }

    if (typeof value.answeredCount !== "number") {
      throw new Error("Invalid next step from the server");
    }

    return {
      kind: "question",
      question: parseSessionQuestion(value.question),
      answeredCount: value.answeredCount,
    };
  }

  if (value.kind === "recommendation") {
    if (!("activities" in value) || !Array.isArray(value.activities)) {
      throw new Error("Invalid next step from the server");
    }

    return {
      kind: "recommendation",
      activities: value.activities.map(parseActivity),
    };
  }

  if (value.kind === "activityWish") {
    return { kind: "activityWish" };
  }

  throw new Error("Invalid next step from the server");
};

export const fetchNextStep = async (
  category: string,
  body: NextStepRequest,
): Promise<NextStep | null> => {
  const response = await fetch(nextStepUrl(category), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load next step: ${response.status}`);
  }

  return parseNextStep(await response.json());
};
