import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  type GivenAnswer,
  getNextStep,
  type ScorableActivity,
  type ScorableQuestion,
} from "./recommendation.ts";

type FixtureActivity = ScorableActivity & { slug: string };

const activity = (
  slug: string,
  traitMarks: FixtureActivity["traitMarks"] = {},
): FixtureActivity => ({ slug, traitMarks });

/** Activities `a0`…`a{count - 1}`; the first `yesCount` mark the trait yes, the rest no. */
const activitiesSplitBy = (
  count: number,
  traitId: string,
  yesCount: number,
): FixtureActivity[] =>
  Array.from({ length: count }, (_, index) =>
    activity(`a${index}`, { [traitId]: index < yesCount ? "yes" : "no" }),
  );

const question = (traitId: string): ScorableQuestion => ({
  id: `q-${traitId}`,
  traitId,
});

const answered = (
  traitId: string,
  answer: GivenAnswer["answer"],
): GivenAnswer => ({ questionId: `q-${traitId}`, answer });

const askedQuestionId = (step: ReturnType<typeof getNextStep>) => {
  assert.equal(step.kind, "question");

  return step.question.id;
};

const recommendedSlugs = (
  step: ReturnType<typeof getNextStep<FixtureActivity, ScorableQuestion>>,
) => {
  assert.equal(step.kind, "recommendation");

  return step.activities.map((recommended) => recommended.slug);
};

describe("getNextStep: next question", () => {
  test("asks the question whose trait splits the candidates most evenly", () => {
    const activities = Array.from({ length: 10 }, (_, index) =>
      activity(`a${index}`, {
        lopsided: index === 0 ? "yes" : "no",
        even: index < 5 ? "yes" : "no",
      }),
    );

    const step = getNextStep({
      activities,
      questions: [question("lopsided"), question("even")],
      answers: [],
    });

    assert.equal(askedQuestionId(step), "q-even");
    assert.equal(step.kind === "question" && step.answeredCount, 0);
  });

  test("never asks an answered question again", () => {
    const activities = Array.from({ length: 10 }, (_, index) =>
      activity(`a${index}`, {
        even: index < 5 ? "yes" : "no",
        other: index % 3 === 0 ? "yes" : "no",
      }),
    );

    const step = getNextStep({
      activities,
      questions: [question("even"), question("other")],
      answers: [answered("even", "dontKnow")],
    });

    assert.equal(askedQuestionId(step), "q-other");
    assert.equal(step.kind === "question" && step.answeredCount, 1);
  });

  test("skips questions whose trait is unknown or identical across the candidates", () => {
    const activities = activitiesSplitBy(10, "even", 5).map((candidate) => ({
      ...candidate,
      traitMarks: { ...candidate.traitMarks, same: "yes" as const },
    }));

    const step = getNextStep({
      activities,
      questions: [question("unmarked"), question("same"), question("even")],
      answers: [],
    });

    assert.equal(askedQuestionId(step), "q-even");
  });

  test("splits the leading candidates rather than the whole category", () => {
    const activities = Array.from({ length: 14 }, (_, index) =>
      activity(`a${index}`, {
        first: index < 7 ? "yes" : "no",
        splitsLeaders: index < 3 ? "yes" : "no",
        splitsTrailers: index < 7 || index > 10 ? "yes" : "no",
      }),
    );

    const step = getNextStep({
      activities,
      questions: [
        question("first"),
        question("splitsTrailers"),
        question("splitsLeaders"),
      ],
      answers: [answered("first", "yes")],
    });

    assert.equal(askedQuestionId(step), "q-splitsLeaders");
  });
});

describe("getNextStep: answers", () => {
  const withTrait = activity("with", { trait: "yes" });
  const unknown = activity("unknown");
  const without = activity("without", { trait: "no" });
  const rank = (answer: GivenAnswer["answer"]) =>
    recommendedSlugs(
      getNextStep({
        activities: [without, unknown, withTrait],
        questions: [question("trait")],
        answers: [answered("trait", answer)],
      }),
    );

  test("Yes ranks activities with the trait first; unknown stays in between", () => {
    assert.deepEqual(rank("yes"), ["with", "unknown", "without"]);
  });

  test("No ranks activities without the trait first; unknown stays in between", () => {
    assert.deepEqual(rank("no"), ["without", "unknown", "with"]);
  });

  test("Probably and Probably not lean the same way as Yes and No", () => {
    assert.deepEqual(rank("probably"), ["with", "unknown", "without"]);
    assert.deepEqual(rank("probablyNot"), ["without", "unknown", "with"]);
  });

  test("Don't know leaves the ranking unchanged", () => {
    assert.deepEqual(rank("dontKnow"), ["without", "unknown", "with"]);
  });

  describe("Probably and Probably not count half as much as a firm answer", () => {
    const yesYes = activity("yesYes", { first: "yes", second: "yes" });
    const yesNo = activity("yesNo", { first: "yes", second: "no" });
    const noYes = activity("noYes", { first: "no", second: "yes" });
    const noNo = activity("noNo", { first: "no", second: "no" });
    const questions = [question("first"), question("second")];

    test("Yes outweighs a conflicting Probably not", () => {
      const step = getNextStep({
        activities: [noYes, noNo, yesYes, yesNo],
        questions,
        answers: [answered("first", "yes"), answered("second", "probablyNot")],
      });

      assert.deepEqual(recommendedSlugs(step), [
        "yesNo",
        "yesYes",
        "noNo",
        "noYes",
      ]);
    });

    test("two Probably answers weigh exactly as much as one opposing Yes", () => {
      const unknown = activity("unknown");
      const firmFirst = activity("firmFirst", {
        first: "yes",
        second: "no",
        third: "no",
      });
      const softFirst = activity("softFirst", {
        first: "no",
        second: "yes",
        third: "yes",
      });

      const step = getNextStep({
        activities: [unknown, firmFirst, softFirst],
        questions: [question("first"), question("second"), question("third")],
        answers: [
          answered("first", "yes"),
          answered("second", "probably"),
          answered("third", "probably"),
        ],
      });

      assert.deepEqual(recommendedSlugs(step), [
        "unknown",
        "firmFirst",
        "softFirst",
      ]);
    });

    test("No outweighs a conflicting Probably", () => {
      const step = getNextStep({
        activities: [noYes, yesYes, noNo, yesNo],
        questions,
        answers: [answered("first", "probably"), answered("second", "no")],
      });

      assert.deepEqual(recommendedSlugs(step), [
        "yesNo",
        "noNo",
        "yesYes",
        "noYes",
      ]);
    });
  });
});

describe("getNextStep: stop conditions", () => {
  test("recommends when only questions with unknown or identical traits remain", () => {
    const activities = Array.from({ length: 10 }, (_, index) =>
      activity(`a${index}`, { even: index < 5 ? "yes" : "no", same: "yes" }),
    );

    const step = getNextStep({
      activities,
      questions: [question("even"), question("same"), question("unmarked")],
      answers: [answered("even", "dontKnow")],
    });

    assert.deepEqual(recommendedSlugs(step), ["a0", "a1", "a2", "a3", "a4"]);
  });

  test("recommends once a few leaders clearly lead the rest, but not before", () => {
    const activities = Array.from({ length: 8 }, (_, index) =>
      activity(`a${index}`, {
        first: index < 3 ? "yes" : "no",
        second: index === 0 ? "yes" : "no",
      }),
    );
    const questions = [question("first"), question("second")];

    const clearLead = getNextStep({
      activities,
      questions,
      answers: [answered("first", "yes")],
    });
    const slightLead = getNextStep({
      activities,
      questions,
      answers: [answered("first", "probably")],
    });

    assert.deepEqual(recommendedSlugs(clearLead), [
      "a0",
      "a1",
      "a2",
      "a3",
      "a4",
    ]);
    assert.equal(askedQuestionId(slightLead), "q-second");
  });

  test("recommends after 15 answered questions even if useful ones remain", () => {
    const traitIds = Array.from({ length: 20 }, (_, index) => `t${index}`);
    const activities = Array.from({ length: 20 }, (_, index) =>
      activity(
        `a${index}`,
        Object.fromEntries(
          traitIds.map((traitId) => [traitId, index < 10 ? "yes" : "no"]),
        ),
      ),
    );
    const questions = traitIds.map(question);
    const answers = traitIds
      .slice(0, 15)
      .map((traitId) => answered(traitId, "dontKnow"));

    const afterFourteen = getNextStep({
      activities,
      questions,
      answers: answers.slice(0, 14),
    });
    const afterFifteen = getNextStep({ activities, questions, answers });

    assert.equal(askedQuestionId(afterFourteen), "q-t14");
    assert.equal(recommendedSlugs(afterFifteen).length, 5);
  });
});

describe("getNextStep: session controls", () => {
  const traitIds = Array.from({ length: 40 }, (_, index) => `t${index}`);
  const manyTraitsActivities = Array.from({ length: 20 }, (_, index) =>
    activity(
      `a${index}`,
      Object.fromEntries(
        traitIds.map((traitId) => [traitId, index < 10 ? "yes" : "no"]),
      ),
    ),
  );
  const manyTraitsQuestions = traitIds.map(question);
  const dontKnowAnswers = (count: number) =>
    traitIds.slice(0, count).map((traitId) => answered(traitId, "dontKnow"));

  test("undoing the last answer equals computing without it", () => {
    const activities = Array.from({ length: 10 }, (_, index) =>
      activity(`a${index}`, {
        even: index < 5 ? "yes" : "no",
        other: index % 3 === 0 ? "yes" : "no",
      }),
    );
    const questions = [question("even"), question("other")];
    const answers = [answered("even", "dontKnow")];

    const afterUndo = getNextStep({
      activities,
      questions,
      answers: answers.slice(0, -1),
    });

    assert.deepEqual(
      afterUndo,
      getNextStep({ activities, questions, answers: [] }),
    );
    assert.equal(askedQuestionId(afterUndo), "q-even");
  });

  test("keeps asking after a rejection although the leaders stand out", () => {
    const activities = activitiesSplitBy(8, "first", 3).map((candidate) => ({
      ...candidate,
      traitMarks: {
        ...candidate.traitMarks,
        second: candidate.slug === "a0" ? ("yes" as const) : ("no" as const),
      },
    }));
    const input = {
      activities,
      questions: [question("first"), question("second")],
      answers: [answered("first", "yes")],
    };

    assert.equal(getNextStep(input).kind, "recommendation");

    const rejected = getNextStep({ ...input, rejectedAtCount: 1 });

    assert.equal(askedQuestionId(rejected), "q-second");
    assert.equal(rejected.kind === "question" && rejected.answeredCount, 1);
  });

  test("counts the question limit from the rejected recommendation", () => {
    const input = {
      activities: manyTraitsActivities,
      questions: manyTraitsQuestions,
    };

    const atLimit = getNextStep({ ...input, answers: dontKnowAnswers(15) });
    const afterRejection = getNextStep({
      ...input,
      answers: dontKnowAnswers(15),
      rejectedAtCount: 15,
    });
    const beforeNewLimit = getNextStep({
      ...input,
      answers: dontKnowAnswers(29),
      rejectedAtCount: 15,
    });
    const atNewLimit = getNextStep({
      ...input,
      answers: dontKnowAnswers(30),
      rejectedAtCount: 15,
    });

    assert.equal(atLimit.kind, "recommendation");
    assert.equal(askedQuestionId(afterRejection), "q-t15");
    assert.equal(askedQuestionId(beforeNewLimit), "q-t29");
    assert.equal(atNewLimit.kind, "recommendation");
  });

  test("shows the recommendation again when no useful question is left after a rejection", () => {
    const activities = activitiesSplitBy(8, "trait", 2);
    const input = {
      activities,
      questions: [question("trait")],
      answers: [answered("trait", "yes")],
    };

    const step = getNextStep({ ...input, rejectedAtCount: 1 });

    assert.deepEqual(step, getNextStep(input));
    assert.equal(step.kind, "recommendation");
  });
});

describe("getNextStep: recommendation", () => {
  test("holds the five best-ranked activities", () => {
    const step = getNextStep({
      activities: activitiesSplitBy(8, "trait", 2).toReversed(),
      questions: [question("trait")],
      answers: [answered("trait", "yes")],
    });

    assert.deepEqual(recommendedSlugs(step), ["a1", "a0", "a7", "a6", "a5"]);
  });

  test("holds every activity when the category has fewer than five", () => {
    const step = getNextStep({
      activities: activitiesSplitBy(3, "trait", 1),
      questions: [question("trait")],
      answers: [],
    });

    assert.deepEqual(recommendedSlugs(step), ["a0", "a1", "a2"]);
  });
});
