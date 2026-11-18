"use client";

import { type ReactNode, useRef, useState } from "react";
import { fetchNextStep } from "@/data/next-step";
import type { Answer, CategorySlug, GivenAnswer, NextStep } from "@/data/types";
import {
  QuizSessionContext,
  type QuizSessionValue,
} from "./quiz-session-context";

type SessionFrame = {
  answers: GivenAnswer[];
  rejectedAtCount?: number;
  step: NextStep;
};

type FailedRequest = {
  answers: GivenAnswer[];
  rejectedAtCount?: number;
};

type QuizSessionProviderProps = {
  category: CategorySlug;
  initialStep: NextStep;
  children: ReactNode;
};

export const QuizSessionProvider = ({
  category,
  initialStep,
  children,
}: QuizSessionProviderProps) => {
  const [frames, setFrames] = useState<SessionFrame[]>([
    { answers: [], step: initialStep },
  ]);
  const [isPending, setIsPending] = useState(false);
  const [failedRequest, setFailedRequest] = useState<FailedRequest | null>(
    null,
  );
  const isPendingRef = useRef(false);

  const current = frames[frames.length - 1];
  if (!current) {
    throw new Error("Quiz session has no steps");
  }

  const requestStep = async (
    answers: GivenAnswer[],
    rejectedAtCount: number | undefined,
  ) => {
    if (isPendingRef.current) return;

    isPendingRef.current = true;
    setIsPending(true);
    setFailedRequest(null);

    try {
      const step = await fetchNextStep(category, { answers, rejectedAtCount });
      if (!step) {
        throw new Error("Failed to load next step: 404");
      }

      setFrames((currentFrames) => [
        ...currentFrames,
        { answers, rejectedAtCount, step },
      ]);
    } catch {
      setFailedRequest({ answers, rejectedAtCount });
    } finally {
      isPendingRef.current = false;
      setIsPending(false);
    }
  };

  const answer = (givenAnswer: Answer) => {
    if (failedRequest || current.step.kind !== "question") return;

    void requestStep(
      [
        ...current.answers,
        { questionId: current.step.question.id, answer: givenAnswer },
      ],
      current.rejectedAtCount,
    );
  };

  const goBack = () => {
    if (isPendingRef.current) return;

    if (failedRequest) {
      setFailedRequest(null);
      return;
    }

    setFrames((currentFrames) =>
      currentFrames.length > 1 ? currentFrames.slice(0, -1) : currentFrames,
    );
  };

  const keepAsking = () => {
    if (failedRequest || current.step.kind !== "recommendation") return;

    void requestStep(current.answers, current.answers.length);
  };

  const startOver = () => {
    if (isPendingRef.current) return;

    setFailedRequest(null);
    setFrames((currentFrames) => currentFrames.slice(0, 1));
  };

  const retry = () => {
    if (!failedRequest) return;

    void requestStep(failedRequest.answers, failedRequest.rejectedAtCount);
  };

  const value: QuizSessionValue = {
    step: current.step,
    isPending,
    error: failedRequest !== null,
    canGoBack: failedRequest !== null || frames.length > 1,
    answer,
    goBack,
    keepAsking,
    startOver,
    retry,
  };

  return (
    <QuizSessionContext.Provider value={value}>
      {children}
    </QuizSessionContext.Provider>
  );
};
