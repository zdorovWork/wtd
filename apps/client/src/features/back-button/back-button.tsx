"use client";

import { sessionReturnFocusId, useQuizSession } from "@/modules/quiz-session";
import { IconButton } from "@/shared/components/icon-button";
import { ArrowLeftIcon } from "@/shared/components/icons";

/** Undoes the last answer; before the first answer it leaves to the home page. */
export const BackButton = () => {
  const { goBack, isPending, canGoBack, step } = useQuizSession();
  const returnFocusId =
    step.kind === "recommendation" ? undefined : sessionReturnFocusId;

  if (!canGoBack) {
    return (
      <IconButton
        id={returnFocusId}
        label="Back"
        icon={<ArrowLeftIcon />}
        href="/"
      />
    );
  }

  return (
    <IconButton
      id={returnFocusId}
      label="Back"
      icon={<ArrowLeftIcon />}
      onClick={goBack}
      disabled={isPending}
    />
  );
};
