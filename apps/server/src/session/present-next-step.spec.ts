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

  it("returns a recommendation when a single leader stands out", () => {
    const step = presentNextStep(
      questions,
      [
        activity("a0", ["split", "other"]),
        activity("a1", ["split"]),
        activity("a2", []),
      ],
      {
        answers: [
          { questionId: "q-split", answer: "yes" },
          { questionId: "q-other", answer: "yes" },
        ],
      },
    );

    expect(step.kind).toBe("recommendation");
  });

  it("returns the remaining leaders when no remaining question splits them", () => {
    const step = presentNextStep(questions, activities, {
      answers: [
        { questionId: "q-split", answer: "dontKnow" },
        { questionId: "q-other", answer: "dontKnow" },
      ],
    });

    expect(step.kind).toBe("recommendation");
    if (step.kind === "recommendation") {
      expect(step.activities.map((recommended) => recommended.slug)).toEqual([
        "a0",
        "a1",
        "a2",
        "a3",
        "a4",
      ]);
    }
  });

  it("returns an activity wish after a rejection when no remaining question splits the leaders", () => {
    expect(
      presentNextStep(questions, activities, {
        answers: [
          { questionId: "q-split", answer: "dontKnow" },
          { questionId: "q-other", answer: "dontKnow" },
        ],
        rejectedAtCount: 2,
      }),
    ).toEqual({ kind: "activityWish" });
  });
});
