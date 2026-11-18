"use client";

import { useQuizSession } from "@/modules/quiz-session";
import { IconButton } from "@/shared/components/icon-button";
import { ArrowLeftIcon } from "@/shared/components/icons";

/** Undoes the last answer; before the first answer it leaves to the home page. */
export const BackButton = () => {
  const { goBack, isPending, canGoBack } = useQuizSession();

  if (!canGoBack) {
    return <IconButton label="Back" icon={<ArrowLeftIcon />} href="/" />;
  }

  return (
    <IconButton
      label="Back"
      icon={<ArrowLeftIcon />}
      onClick={goBack}
      disabled={isPending}
    />
  );
};
