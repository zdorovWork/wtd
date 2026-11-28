import { BadRequestException } from "@nestjs/common";
import { getNextStep } from "../engine/recommendation";
import type { Activity, Question } from "../types";
import type { NextStepBodyDto } from "./next-step.dto";

export type NextStepResponse =
  | {
      kind: "question";
      question: { id: string; text: string };
      answeredCount: number;
    }
  | { kind: "recommendation"; activities: Activity[] }
  | { kind: "activityWish" };

export const presentNextStep = (
  questions: Question[],
  activities: Activity[],
  body: NextStepBodyDto,
): NextStepResponse => {
  const questionIds = new Set(questions.map((question) => question.id));
  const unknownQuestion = body.answers.find(
    (given) => !questionIds.has(given.questionId),
  );
  if (unknownQuestion) {
    throw new BadRequestException("Unknown question id");
  }

  const step = getNextStep({
    activities,
    questions,
    answers: body.answers,
    rejectedAtCount: body.rejectedAtCount,
  });

  if (step.kind === "question") {
    return {
      kind: "question",
      question: { id: step.question.id, text: step.question.text },
      answeredCount: step.answeredCount,
    };
  }

  if (step.kind === "recommendation") {
    return { kind: "recommendation", activities: step.activities };
  }

  return { kind: "activityWish" };
};
