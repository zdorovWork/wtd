import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  type GivenAnswer,
  getNextStep,
  type ScorableActivity,
  type ScorableQuestion,
} from "./recommendation.ts";

type FixtureActivity = ScorableActivity & { slug: string };

const activity = (slug: string, tags: string[] = []): FixtureActivity => ({
  slug,
  tags,
});

/** Activities `a0`…`a{count - 1}`; the first `withTagCount` have the tag, the rest lack it. */
const activitiesSplitBy = (
  count: number,
  tagId: string,
  withTagCount: number,
): FixtureActivity[] =>
  Array.from({ length: count }, (_, index) =>
    activity(`a${index}`, index < withTagCount ? [tagId] : []),
  );

/** The tag ids whose condition holds. */
const tagsWhere = (conditions: Record<string, boolean>): string[] =>
  Object.keys(conditions).filter((tagId) => conditions[tagId]);

const question = (tagId: string): ScorableQuestion => ({
  id: `q-${tagId}`,
  tagId,
});

const answered = (
  tagId: string,
  answer: GivenAnswer["answer"],
): GivenAnswer => ({ questionId: `q-${tagId}`, answer });

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
  test("asks the question whose tag splits the candidates most evenly", () => {
    const activities = Array.from({ length: 10 }, (_, index) =>
      activity(
        `a${index}`,
        tagsWhere({ lopsided: index === 0, even: index < 5 }),
      ),
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
      activity(
        `a${index}`,
        tagsWhere({ even: index < 5, other: index % 3 === 0 }),
      ),
    );

    const step = getNextStep({
      activities,
      questions: [question("even"), question("other")],
      answers: [answered("even", "dontKnow")],
    });

    assert.equal(askedQuestionId(step), "q-other");
    assert.equal(step.kind === "question" && step.answeredCount, 1);
  });

  test("skips questions whose tag no candidate or every candidate has", () => {
    const activities = activitiesSplitBy(10, "even", 5).map((candidate) => ({
      ...candidate,
      tags: [...candidate.tags, "everyone"],
    }));

    const step = getNextStep({
      activities,
      questions: [question("nobody"), question("everyone"), question("even")],
      answers: [],
    });

    assert.equal(askedQuestionId(step), "q-even");
  });

  test("splits the leading candidates rather than the whole category", () => {
    const activities = Array.from({ length: 14 }, (_, index) =>
      activity(
        `a${index}`,
        tagsWhere({
          first: index < 7,
          splitsLeaders: index < 3,
          splitsTrailers: index < 7 || index > 10,
        }),
      ),
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
  const withTag = activity("with", ["tag"]);
  const withoutTag = activity("without");
  const rank = (answer: GivenAnswer["answer"]) =>
    recommendedSlugs(
      getNextStep({
        activities: [withoutTag, withTag],
        questions: [question("tag")],
        answers: [answered("tag", answer)],
      }),
    );

  test("Yes ranks activities with the tag first", () => {
    assert.deepEqual(rank("yes"), ["with", "without"]);
  });

  test("No ranks activities without the tag first", () => {
    assert.deepEqual(rank("no"), ["without", "with"]);
  });

  test("Probably and Probably not lean the same way as Yes and No", () => {
    assert.deepEqual(rank("probably"), ["with", "without"]);
    assert.deepEqual(rank("probablyNot"), ["without", "with"]);
  });

  test("Don't know leaves the ranking unchanged", () => {
    assert.deepEqual(rank("dontKnow"), ["without", "with"]);
  });

  describe("Probably and Probably not count half as much as a firm answer", () => {
    const yesYes = activity("yesYes", ["first", "second"]);
    const yesNo = activity("yesNo", ["first"]);
    const noYes = activity("noYes", ["second"]);
    const noNo = activity("noNo");
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
      const firmFirst = activity("firmFirst", ["first"]);
      const softFirst = activity("softFirst", ["second", "third"]);
      const rankInOrder = (activities: FixtureActivity[]) =>
        recommendedSlugs(
          getNextStep({
            activities,
            questions: [
              question("first"),
              question("second"),
              question("third"),
            ],
            answers: [
              answered("first", "yes"),
              answered("second", "probably"),
              answered("third", "probably"),
            ],
          }),
        );

      assert.deepEqual(rankInOrder([firmFirst, softFirst]), [
        "firmFirst",
        "softFirst",
      ]);
      assert.deepEqual(rankInOrder([softFirst, firmFirst]), [
        "softFirst",
        "firmFirst",
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
  test("recommends when only questions whose tag no candidate or every candidate has remain", () => {
    const activities = Array.from({ length: 10 }, (_, index) =>
      activity(`a${index}`, tagsWhere({ even: index < 5, everyone: true })),
    );

    const step = getNextStep({
      activities,
      questions: [question("even"), question("everyone"), question("nobody")],
      answers: [answered("even", "dontKnow")],
    });

    assert.deepEqual(recommendedSlugs(step), ["a0", "a1", "a2", "a3", "a4"]);
  });

  test("recommends once a few leaders clearly lead the rest, but not before", () => {
    const activities = Array.from({ length: 8 }, (_, index) =>
      activity(
        `a${index}`,
        tagsWhere({ first: index < 3, second: index === 0 }),
      ),
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
    const tagIds = Array.from({ length: 20 }, (_, index) => `t${index}`);
    const activities = Array.from({ length: 20 }, (_, index) =>
      activity(`a${index}`, index < 10 ? tagIds : []),
    );
    const questions = tagIds.map(question);
    const answers = tagIds
      .slice(0, 15)
      .map((tagId) => answered(tagId, "dontKnow"));

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
  const tagIds = Array.from({ length: 40 }, (_, index) => `t${index}`);
  const manyTagsActivities = Array.from({ length: 20 }, (_, index) =>
    activity(`a${index}`, index < 10 ? tagIds : []),
  );
  const manyTagsQuestions = tagIds.map(question);
  const dontKnowAnswers = (count: number) =>
    tagIds.slice(0, count).map((tagId) => answered(tagId, "dontKnow"));

  test("undoing the last answer equals computing without it", () => {
    const activities = Array.from({ length: 10 }, (_, index) =>
      activity(
        `a${index}`,
        tagsWhere({ even: index < 5, other: index % 3 === 0 }),
      ),
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
      tags:
        candidate.slug === "a0"
          ? [...candidate.tags, "second"]
          : candidate.tags,
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
      activities: manyTagsActivities,
      questions: manyTagsQuestions,
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
    const activities = activitiesSplitBy(8, "tag", 2);
    const input = {
      activities,
      questions: [question("tag")],
      answers: [answered("tag", "yes")],
    };

    const step = getNextStep({ ...input, rejectedAtCount: 1 });

    assert.deepEqual(step, getNextStep(input));
    assert.equal(step.kind, "recommendation");
  });
});

describe("getNextStep: recommendation", () => {
  test("holds the five best-ranked activities", () => {
    const step = getNextStep({
      activities: activitiesSplitBy(8, "tag", 2).toReversed(),
      questions: [question("tag")],
      answers: [answered("tag", "yes")],
    });

    assert.deepEqual(recommendedSlugs(step), ["a1", "a0", "a7", "a6", "a5"]);
  });

  test("holds every activity when the category has fewer than five", () => {
    const step = getNextStep({
      activities: activitiesSplitBy(3, "tag", 1),
      questions: [question("tag")],
      answers: [],
    });

    assert.deepEqual(recommendedSlugs(step), ["a0", "a1", "a2"]);
  });
});
