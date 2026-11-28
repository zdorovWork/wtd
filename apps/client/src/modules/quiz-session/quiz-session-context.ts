"use client";

import { createContext, useContext } from "react";
import type { Answer, NextStep } from "@/data/types";

export const sessionReturnFocusId = "session-return-focus";

export type QuizSessionValue = {
  step: NextStep;
  isPending: boolean;
  error: boolean;
  canGoBack: boolean;
  canAnswer: boolean;
  canKeepAsking: boolean;
  isActivityWishOpen: boolean;
  isActivityWishStep: boolean;
  answer: (answer: Answer) => void;
  /** Undoes the last answer. */
  goBack: () => void;
  keepAsking: () => void;
  startOver: () => void;
  retry: () => void;
  saveActivityWish: (text: string) => void;
  dismissActivityWish: () => void;
};

export const QuizSessionContext = createContext<QuizSessionValue | null>(null);

export const useQuizSession = (): QuizSessionValue => {
  const value = useContext(QuizSessionContext);

  if (!value) {
    throw new Error("useQuizSession must be used inside QuizSessionProvider");
  }

  return value;
};
