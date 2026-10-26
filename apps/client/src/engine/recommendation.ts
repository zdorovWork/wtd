export type TraitMark = "yes" | "no";

export type Answer = "yes" | "probably" | "dontKnow" | "probablyNot" | "no";

export type ScorableActivity = {
  /** Keyed by trait id; a trait missing from the record is unknown. */
  traitMarks: Record<string, TraitMark>;
};

export type ScorableQuestion = {
  id: string;
  traitId: string;
};

export type GivenAnswer = {
  questionId: string;
  answer: Answer;
};

export type SessionInput<
  TActivity extends ScorableActivity,
  TQuestion extends ScorableQuestion,
> = {
  activities: TActivity[];
  questions: TQuestion[];
  /** In the order they were given. */
  answers: GivenAnswer[];
  /** Number of answers given when the person last rejected a recommendation. */
  rejectedAtCount?: number;
};

export type NextStep<
  TActivity extends ScorableActivity,
  TQuestion extends ScorableQuestion,
> =
  | { kind: "question"; question: TQuestion; answeredCount: number }
  | { kind: "recommendation"; activities: TActivity[] };

export const RECOMMENDATION_SIZE = 5;

/** Answered questions after which wtd recommends even without clear leaders. */
export const QUESTION_LIMIT = 15;

/** Activities trailing the top score by less than this are still leading. */
export const LEADER_GAP = 2;

export const ANSWER_WEIGHTS: Record<Answer, number> = {
  yes: 1,
  probably: 0.5,
  dontKnow: 0,
  probablyNot: -0.5,
  no: -1,
};

const MARK_DIRECTIONS: Record<TraitMark, number> = { yes: 1, no: -1 };

type Scored<TActivity> = { activity: TActivity; score: number };

const scoreActivity = (
  activity: ScorableActivity,
  traitIdByQuestionId: Map<string, string>,
  answers: GivenAnswer[],
): number =>
  answers.reduce((score, given) => {
    const traitId = traitIdByQuestionId.get(given.questionId);
    const mark = traitId ? activity.traitMarks[traitId] : undefined;
    if (!mark) return score;

    return score + ANSWER_WEIGHTS[given.answer] * MARK_DIRECTIONS[mark];
  }, 0);

/** Highest score first; ties keep the order the activities came in. */
const rankActivities = <TActivity extends ScorableActivity>(
  activities: TActivity[],
  questions: ScorableQuestion[],
  answers: GivenAnswer[],
): Scored<TActivity>[] => {
  const traitIdByQuestionId = new Map(
    questions.map((question) => [question.id, question.traitId]),
  );

  return activities
    .map((activity) => ({
      activity,
      score: scoreActivity(activity, traitIdByQuestionId, answers),
    }))
    .toSorted((first, second) => second.score - first.score);
};

const findLeaders = <TActivity>(ranked: Scored<TActivity>[]): TActivity[] => {
  const topScore = ranked[0]?.score ?? 0;

  return ranked
    .filter((scored) => scored.score > topScore - LEADER_GAP)
    .map((scored) => scored.activity);
};

const splitBalance = (
  candidates: ScorableActivity[],
  question: ScorableQuestion,
): number => {
  const marks = candidates.map(
    (candidate) => candidate.traitMarks[question.traitId],
  );
  const yesCount = marks.filter((mark) => mark === "yes").length;
  const noCount = marks.filter((mark) => mark === "no").length;

  return Math.min(yesCount, noCount);
};

export const getNextStep = <
  TActivity extends ScorableActivity,
  TQuestion extends ScorableQuestion,
>({
  activities,
  questions,
  answers,
  rejectedAtCount,
}: SessionInput<TActivity, TQuestion>): NextStep<TActivity, TQuestion> => {
  const ranked = rankActivities(activities, questions, answers);
  const leaders = findLeaders(ranked);
  const answeredIds = new Set(answers.map((given) => given.questionId));
  const [bestQuestion] = questions
    .filter(
      (candidate) =>
        !answeredIds.has(candidate.id) && splitBalance(leaders, candidate) > 0,
    )
    .toSorted(
      (first, second) =>
        splitBalance(leaders, second) - splitBalance(leaders, first),
    );

  const wasRejected = rejectedAtCount !== undefined;
  const leadersStandOut = !wasRejected && leaders.length <= RECOMMENDATION_SIZE;
  const reachedLimit =
    answers.length - (rejectedAtCount ?? 0) >= QUESTION_LIMIT;

  if (leadersStandOut || reachedLimit || !bestQuestion) {
    return {
      kind: "recommendation",
      activities: ranked
        .slice(0, RECOMMENDATION_SIZE)
        .map((scored) => scored.activity),
    };
  }

  return {
    kind: "question",
    question: bestQuestion,
    answeredCount: answers.length,
  };
};
