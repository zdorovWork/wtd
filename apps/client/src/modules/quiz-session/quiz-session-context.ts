"use client";

import { createContext, useContext } from "react";
import type { Activity, Question } from "@/data/types";
import type { Answer, NextStep } from "@/engine/recommendation";

export type QuizSessionValue = {
  step: NextStep<Activity, Question>;
  answer: (answer: Answer) => void;
  /** Undoes the last answer. */
  goBack: () => void;
  keepAsking: () => void;
  startOver: () => void;
};

export const QuizSessionContext = createContext<QuizSessionValue | null>(null);

export const useQuizSession = (): QuizSessionValue => {
  const value = useContext(QuizSessionContext);

  if (!value) {
    throw new Error("useQuizSession must be used inside QuizSessionProvider");
  }

  return value;
};
