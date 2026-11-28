import type { GivenAnswer, NextStep } from "../../data/types.ts";

export const ACTIVITY_WISH_MAX_LENGTH = 500;

export type SessionFrame = {
  answers: GivenAnswer[];
  rejectedAtCount?: number;
  step: NextStep;
  activityWish?: string;
  isActivityWishOpen: boolean;
};

export type SessionView = {
  step: NextStep;
  isActivityWishOpen: boolean;
  isActivityWishStep: boolean;
  canKeepAsking: boolean;
  canAnswer: boolean;
};

const currentFrame = (frames: SessionFrame[]): SessionFrame => {
  const current = frames.at(-1);
  if (!current) {
    throw new Error("Session has no steps");
  }

  return current;
};

const displayedStep = (frames: SessionFrame[]): NextStep => {
  const current = currentFrame(frames);
  if (current.step.kind !== "activityWish") {
    return current.step;
  }

  for (let index = frames.length - 2; index >= 0; index -= 1) {
    const underlying = frames[index]?.step;
    if (underlying && underlying.kind !== "activityWish") {
      return underlying;
    }
  }

  return current.step;
};

export const createInitialFrames = (initialStep: NextStep): SessionFrame[] => [
  {
    answers: [],
    step: initialStep,
    isActivityWishOpen: initialStep.kind === "activityWish",
  },
];

export const appendStep = (
  frames: SessionFrame[],
  next: {
    answers: GivenAnswer[];
    rejectedAtCount?: number;
    step: NextStep;
  },
): SessionFrame[] => [
  ...frames,
  {
    answers: next.answers,
    rejectedAtCount: next.rejectedAtCount,
    step: next.step,
    isActivityWishOpen: next.step.kind === "activityWish",
  },
];

export const popFrame = (frames: SessionFrame[]): SessionFrame[] =>
  frames.length > 1 ? frames.slice(0, -1) : frames;

export const resetFrames = (frames: SessionFrame[]): SessionFrame[] =>
  frames.slice(0, 1);

export const sessionView = (frames: SessionFrame[]): SessionView => {
  const current = currentFrame(frames);
  const step = displayedStep(frames);
  const overlayingWish = current.step.kind === "activityWish";

  return {
    step,
    isActivityWishOpen: current.isActivityWishOpen,
    isActivityWishStep: overlayingWish,
    canKeepAsking: step.kind === "recommendation" && !overlayingWish,
    canAnswer: step.kind === "question" && !overlayingWish,
  };
};

const updateCurrent = (
  frames: SessionFrame[],
  update: (frame: SessionFrame) => SessionFrame,
): SessionFrame[] => {
  const current = currentFrame(frames);

  return [...frames.slice(0, -1), update(current)];
};

export const saveActivityWish = (
  frames: SessionFrame[],
  text: string,
): SessionFrame[] => {
  const trimmed = text.trim().slice(0, ACTIVITY_WISH_MAX_LENGTH);

  return updateCurrent(frames, (frame) => {
    if (!frame.isActivityWishOpen) {
      return frame;
    }

    if (!trimmed) {
      return { ...frame, isActivityWishOpen: false };
    }

    return {
      ...frame,
      isActivityWishOpen: false,
      activityWish: trimmed,
    };
  });
};

export const dismissActivityWish = (frames: SessionFrame[]): SessionFrame[] =>
  updateCurrent(frames, (frame) =>
    frame.isActivityWishOpen ? { ...frame, isActivityWishOpen: false } : frame,
  );
