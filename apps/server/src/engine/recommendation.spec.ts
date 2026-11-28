import {
  type GivenAnswer,
  getNextStep,
  type ScorableActivity,
  type ScorableQuestion,
} from "./recommendation";

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
  expect(step.kind).toBe("question");
  if (step.kind !== "question") {
    throw new Error("expected a question step");
  }

  return step.question.id;
};

const recommendedSlugs = (
  step: ReturnType<typeof getNextStep<FixtureActivity, ScorableQuestion>>,
) => {
  expect(step.kind).toBe("recommendation");
  if (step.kind !== "recommendation") {
    throw new Error("expected a recommendation step");
  }

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

    expect(askedQuestionId(step)).toBe("q-even");
    expect(step.kind === "question" && step.answeredCount).toBe(0);
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

    expect(askedQuestionId(step)).toBe("q-other");
    expect(step.kind === "question" && step.answeredCount).toBe(1);
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

    expect(askedQuestionId(step)).toBe("q-even");
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

    expect(askedQuestionId(step)).toBe("q-splitsLeaders");
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
    expect(rank("yes")).toEqual(["with"]);
  });

  test("No ranks activities without the tag first", () => {
    expect(rank("no")).toEqual(["without"]);
  });

  test("Probably and Probably not lean the same way as Yes and No", () => {
    expect(rank("probably")).toEqual(["with", "without"]);
    expect(rank("probablyNot")).toEqual(["without", "with"]);
  });

  test("Don't know leaves the ranking unchanged", () => {
    expect(rank("dontKnow")).toEqual(["without", "with"]);
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

      expect(recommendedSlugs(step)).toEqual(["yesNo", "yesYes"]);
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

      expect(rankInOrder([firmFirst, softFirst])).toEqual([
        "firmFirst",
        "softFirst",
      ]);
      expect(rankInOrder([softFirst, firmFirst])).toEqual([
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

      expect(recommendedSlugs(step)).toEqual(["yesNo", "noNo"]);
    });
  });
});

describe("getNextStep: stop conditions", () => {
  test("recommends the remaining leaders when no unanswered question still splits them", () => {
    const activities = Array.from({ length: 10 }, (_, index) =>
      activity(`a${index}`, tagsWhere({ even: index < 5, everyone: true })),
    );

    const step = getNextStep({
      activities,
      questions: [question("even"), question("everyone"), question("nobody")],
      answers: [answered("even", "dontKnow")],
    });

    expect(recommendedSlugs(step)).toEqual(["a0", "a1", "a2", "a3", "a4"]);
  });

  test("keeps asking while more than one leader remains and a question can still split them", () => {
    const activities = Array.from({ length: 8 }, (_, index) =>
      activity(
        `a${index}`,
        tagsWhere({ first: index < 3, second: index === 0 }),
      ),
    );
    const questions = [question("first"), question("second")];

    const threeLeaders = getNextStep({
      activities,
      questions,
      answers: [answered("first", "yes")],
    });
    const oneLeader = getNextStep({
      activities,
      questions,
      answers: [answered("first", "yes"), answered("second", "yes")],
    });

    expect(askedQuestionId(threeLeaders)).toBe("q-second");
    expect(recommendedSlugs(oneLeader)).toEqual(["a0"]);
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

    expect(askedQuestionId(afterFourteen)).toBe("q-t14");
    expect(recommendedSlugs(afterFifteen)).toHaveLength(5);
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

    expect(afterUndo).toEqual(
      getNextStep({ activities, questions, answers: [] }),
    );
    expect(askedQuestionId(afterUndo)).toBe("q-even");
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

    expect(atLimit.kind).toBe("recommendation");
    expect(askedQuestionId(afterRejection)).toBe("q-t15");
    expect(askedQuestionId(beforeNewLimit)).toBe("q-t29");
    expect(atNewLimit.kind).toBe("recommendation");
  });

  test("asks for an activity wish when no useful question is left after a rejection", () => {
    const activities = activitiesSplitBy(8, "tag", 2);
    const input = {
      activities,
      questions: [question("tag")],
      answers: [answered("tag", "yes")],
    };

    expect(recommendedSlugs(getNextStep(input))).toEqual(["a0", "a1"]);
    expect(getNextStep({ ...input, rejectedAtCount: 1 })).toEqual({
      kind: "activityWish",
    });
  });
});

describe("getNextStep: recommendation", () => {
  test("holds the remaining leaders rather than padding with the rest of the ranking", () => {
    const step = getNextStep({
      activities: activitiesSplitBy(8, "tag", 2).toReversed(),
      questions: [question("tag")],
      answers: [answered("tag", "yes")],
    });

    expect(recommendedSlugs(step)).toEqual(["a1", "a0"]);
  });

  test("holds every remaining leader when there are fewer than five", () => {
    const step = getNextStep({
      activities: activitiesSplitBy(3, "tag", 1),
      questions: [question("tag"), question("everyone")],
      answers: [answered("tag", "dontKnow")],
    });

    expect(recommendedSlugs(step)).toEqual(["a0", "a1", "a2"]);
  });
});
