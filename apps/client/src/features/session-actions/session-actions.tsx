"use client";

import { useQuizSession } from "@/modules/quiz-session";
import { Button } from "@/shared/components/button";
import { HomeIcon, ReplayIcon } from "@/shared/components/icons";
import { Typography } from "@/shared/components/typography";

export const SessionActions = () => {
  const { keepAsking, startOver } = useQuizSession();

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={keepAsking}
        className="self-center rounded-lg underline decoration-2 underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak"
      >
        <Typography as="span" size="sm" weight="bold">
          Not quite? Keep asking
        </Typography>
      </button>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" href="/">
          <HomeIcon />
          Home
        </Button>
        <Button variant="primary" onClick={startOver}>
          <ReplayIcon />
          Again
        </Button>
      </div>
    </div>
  );
};
