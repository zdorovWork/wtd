import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { NextStep } from "../../data/types.ts";
import {
  ACTIVITY_WISH_MAX_LENGTH,
  appendStep,
  createInitialFrames,
  dismissActivityWish,
  popFrame,
  resetFrames,
  saveActivityWish,
  sessionView,
} from "./session-frame.ts";

const question: NextStep = {
  kind: "question",
  question: { id: "q1", text: "Co-op?" },
  answeredCount: 0,
};

const laterQuestion: NextStep = {
  kind: "question",
  question: { id: "q2", text: "Story?" },
  answeredCount: 1,
};

const recommendation: NextStep = {
  kind: "recommendation",
  activities: [],
};

const wish: NextStep = { kind: "activityWish" };

describe("sessionView", () => {
  test("keeps the previous recommendation on screen when the next step is an activity wish", () => {
    const frames = appendStep(createInitialFrames(recommendation), {
      answers: [],
      rejectedAtCount: 0,
      step: wish,
    });

    assert.deepEqual(sessionView(frames), {
      step: recommendation,
      isActivityWishOpen: true,
      isActivityWishStep: true,
      canKeepAsking: false,
      canAnswer: false,
    });
  });

  test("keeps the previous question on screen when the next step is an activity wish", () => {
    const frames = appendStep(createInitialFrames(question), {
      answers: [{ questionId: "q1", answer: "yes" }],
      step: wish,
    });

    assert.deepEqual(sessionView(frames), {
      step: question,
      isActivityWishOpen: true,
      isActivityWishStep: true,
      canKeepAsking: false,
      canAnswer: false,
    });
  });

  test("shows an activity wish with no underlying question or recommendation", () => {
    assert.deepEqual(sessionView(createInitialFrames(wish)), {
      step: wish,
      isActivityWishOpen: true,
      isActivityWishStep: true,
      canKeepAsking: false,
      canAnswer: false,
    });
  });

  test("does not infer an activity wish from a recommendation", () => {
    assert.deepEqual(sessionView(createInitialFrames(recommendation)), {
      step: recommendation,
      isActivityWishOpen: false,
      isActivityWishStep: false,
      canKeepAsking: true,
      canAnswer: false,
    });
  });
});

describe("activity wish text", () => {
  test("stores a trimmed wish on the frame and closes the ask", () => {
    const open = appendStep(createInitialFrames(recommendation), {
      answers: [],
      step: wish,
    });
    const saved = saveActivityWish(open, "  Hades  ");

    assert.equal(sessionView(saved).isActivityWishOpen, false);
    assert.equal(saved.at(-1)?.activityWish, "Hades");
  });

  test("caps the stored wish at 500 characters", () => {
    const open = appendStep(createInitialFrames(wish), {
      answers: [],
      step: wish,
    });
    const saved = saveActivityWish(open, `${"a".repeat(501)} `);

    assert.equal(saved.at(-1)?.activityWish?.length, ACTIVITY_WISH_MAX_LENGTH);
  });

  test("empty submit closes without storing", () => {
    const open = appendStep(createInitialFrames(recommendation), {
      answers: [],
      step: wish,
    });
    const closed = saveActivityWish(open, "   ");

    assert.equal(sessionView(closed).isActivityWishOpen, false);
    assert.equal(closed.at(-1)?.activityWish, undefined);
  });

  test("dismiss closes without storing and does not reopen", () => {
    const open = appendStep(createInitialFrames(recommendation), {
      answers: [],
      step: wish,
    });
    const closed = dismissActivityWish(open);

    assert.equal(sessionView(closed).isActivityWishOpen, false);
    assert.equal(closed.at(-1)?.activityWish, undefined);
    assert.equal(sessionView(closed).canKeepAsking, false);
  });

  test("back restores a stored wish with its frame", () => {
    const withWish = saveActivityWish(
      appendStep(createInitialFrames(question), {
        answers: [{ questionId: "q1", answer: "yes" }],
        step: wish,
      }),
      "Hades",
    );
    const later = appendStep(withWish, {
      answers: [{ questionId: "q1", answer: "yes" }],
      step: laterQuestion,
    });

    const restored = popFrame(later);

    assert.equal(restored.at(-1)?.activityWish, "Hades");
    assert.equal(sessionView(restored).isActivityWishOpen, false);
  });

  test("start over drops the wish with the rest of the session", () => {
    const withWish = saveActivityWish(
      appendStep(createInitialFrames(question), {
        answers: [{ questionId: "q1", answer: "yes" }],
        step: wish,
      }),
      "Hades",
    );

    assert.equal(resetFrames(withWish).at(-1)?.activityWish, undefined);
    assert.equal(resetFrames(withWish).at(-1)?.step.kind, "question");
  });
});
