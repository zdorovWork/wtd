"use client";

import { type ReactNode, useRef, useState } from "react";
import { fetchNextStep } from "@/data/next-step";
import type { Answer, GivenAnswer, NextStep } from "@/data/types";
import {
  QuizSessionContext,
  type QuizSessionValue,
} from "./quiz-session-context";
import {
  appendStep,
  dismissActivityWish as closeActivityWish,
  createInitialFrames,
  popFrame,
  resetFrames,
  sessionView,
  saveActivityWish as storeActivityWish,
} from "./session-frame";

type FailedRequest = {
  answers: GivenAnswer[];
  rejectedAtCount?: number;
};

type QuizSessionProviderProps = {
  category: string;
  initialStep: NextStep;
  children: ReactNode;
};

export const QuizSessionProvider = ({
  category,
  initialStep,
  children,
}: QuizSessionProviderProps) => {
  const [frames, setFrames] = useState(() => createInitialFrames(initialStep));
  const [isPending, setIsPending] = useState(false);
  const [failedRequest, setFailedRequest] = useState<FailedRequest | null>(
    null,
  );
  const isPendingRef = useRef(false);

  const current = frames.at(-1);
  if (!current) {
    throw new Error("Quiz session has no steps");
  }

  const view = sessionView(frames);

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

      setFrames((currentFrames) =>
        appendStep(currentFrames, { answers, rejectedAtCount, step }),
      );
    } catch {
      setFailedRequest({ answers, rejectedAtCount });
    } finally {
      isPendingRef.current = false;
      setIsPending(false);
    }
  };

  const answer = (givenAnswer: Answer) => {
    if (failedRequest || !view.canAnswer || current.step.kind !== "question") {
      return;
    }

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

    setFrames(popFrame);
  };

  const keepAsking = () => {
    if (failedRequest || !view.canKeepAsking) return;

    void requestStep(current.answers, current.answers.length);
  };

  const startOver = () => {
    if (isPendingRef.current) return;

    setFailedRequest(null);
    setFrames(resetFrames);
  };

  const retry = () => {
    if (!failedRequest) return;

    void requestStep(failedRequest.answers, failedRequest.rejectedAtCount);
  };

  const saveActivityWish = (text: string) => {
    setFrames((currentFrames) => storeActivityWish(currentFrames, text));
  };

  const dismissActivityWish = () => {
    setFrames(closeActivityWish);
  };

  const value: QuizSessionValue = {
    step: view.step,
    isPending,
    error: failedRequest !== null,
    canGoBack: failedRequest !== null || frames.length > 1,
    canAnswer: view.canAnswer,
    canKeepAsking: view.canKeepAsking,
    isActivityWishOpen: view.isActivityWishOpen,
    isActivityWishStep: view.isActivityWishStep,
    answer,
    goBack,
    keepAsking,
    startOver,
    retry,
    saveActivityWish,
    dismissActivityWish,
  };

  return (
    <QuizSessionContext.Provider value={value}>
      {children}
    </QuizSessionContext.Provider>
  );
};
