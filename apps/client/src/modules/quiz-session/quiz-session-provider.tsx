"use client";

import { type ReactNode, useState } from "react";
import type { SessionData } from "@/data/types";
import {
  type Answer,
  type GivenAnswer,
  getNextStep,
} from "@/engine/recommendation";
import {
  QuizSessionContext,
  type QuizSessionValue,
} from "./quiz-session-context";

type SessionProgress = {
  answers: GivenAnswer[];
  rejectedAtCount: number | undefined;
};

const initialProgress: SessionProgress = {
  answers: [],
  rejectedAtCount: undefined,
};

type QuizSessionProviderProps = {
  sessionData: SessionData;
  children: ReactNode;
};

export const QuizSessionProvider = ({
  sessionData,
  children,
}: QuizSessionProviderProps) => {
  const [progress, setProgress] = useState<SessionProgress>(initialProgress);
  const step = getNextStep({
    activities: sessionData.activities,
    questions: sessionData.questions,
    answers: progress.answers,
    rejectedAtCount: progress.rejectedAtCount,
  });

  const answer = (givenAnswer: Answer) => {
    if (step.kind !== "question") return;

    setProgress((current) => ({
      ...current,
      answers: [
        ...current.answers,
        { questionId: step.question.id, answer: givenAnswer },
      ],
    }));
  };

  const goBack = () => {
    setProgress((current) => {
      const remainingAnswers = current.answers.slice(0, -1);
      const isRejectionUndone =
        current.rejectedAtCount !== undefined &&
        current.rejectedAtCount > remainingAnswers.length;

      return {
        answers: remainingAnswers,
        rejectedAtCount: isRejectionUndone
          ? undefined
          : current.rejectedAtCount,
      };
    });
  };

  const keepAsking = () => {
    setProgress((current) => ({
      ...current,
      rejectedAtCount: current.answers.length,
    }));
  };

  const startOver = () => {
    setProgress(initialProgress);
  };

  const value: QuizSessionValue = {
    step,
    answer,
    goBack,
    keepAsking,
    startOver,
  };

  return (
    <QuizSessionContext.Provider value={value}>
      {children}
    </QuizSessionContext.Provider>
  );
};
