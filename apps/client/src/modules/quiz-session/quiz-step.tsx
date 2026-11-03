"use client";

import type { ReactNode } from "react";
import { useQuizSession } from "./quiz-session-context";

type QuizStepProps = {
  question: ReactNode;
  recommendation: ReactNode;
};

/** Shows the slot that matches the current step of the session. */
export const QuizStep = ({ question, recommendation }: QuizStepProps) => {
  const { step } = useQuizSession();

  return step.kind === "question" ? question : recommendation;
};
