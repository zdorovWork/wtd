"use client";

import { AnswerOption, answerOrder } from "@/features/answer-option";
import { useQuizSession } from "@/modules/quiz-session";
import { Typography } from "@/shared/components/typography";

export const AnswerList = () => {
  const { answer } = useQuizSession();

  return (
    <fieldset className="mt-8 flex flex-col gap-3">
      <Typography as="legend" className="sr-only">
        Your answer
      </Typography>
      {answerOrder.map((answerKind) => (
        <AnswerOption key={answerKind} answer={answerKind} onSelect={answer} />
      ))}
    </fieldset>
  );
};
