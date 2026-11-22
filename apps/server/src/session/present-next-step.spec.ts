import { BadRequestException } from "@nestjs/common";
import type { Activity, Question } from "../types";
import { presentNextStep } from "./present-next-step";

const questions: Question[] = [
  {
    id: "q-split",
    tagId: "split",
    text: "Want the split tag?",
  },
  {
    id: "q-other",
    tagId: "other",
    text: "Want the other tag?",
  },
];

const activity = (slug: string, tags: string[]): Activity => ({
  category: "games",
  slug,
  title: slug,
  description: slug,
  year: 2020,
  genres: ["Action"],
  tags,
  platforms: ["PC"],
  playModes: ["Single-player"],
});

const activities: Activity[] = [
  activity("a0", ["split"]),
  activity("a1", ["split"]),
  activity("a2", ["split"]),
  activity("a3", ["other"]),
  activity("a4", ["other"]),
  activity("a5", ["other"]),
];

describe("presentNextStep", () => {
  it("rejects an unknown question id", () => {
    expect(() =>
      presentNextStep(questions, activities, {
        answers: [{ questionId: "no-such-question", answer: "yes" }],
      }),
    ).toThrow(BadRequestException);
  });

  it("returns a session question as id and text", () => {
    expect(presentNextStep(questions, activities, { answers: [] })).toEqual({
      kind: "question",
      question: { id: "q-split", text: "Want the split tag?" },
      answeredCount: 0,
    });
  });
});
