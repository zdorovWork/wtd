"use client";

import { sessionReturnFocusId, useQuizSession } from "@/modules/quiz-session";
import { Button } from "@/shared/components/button";
import { HomeIcon, ReplayIcon } from "@/shared/components/icons";
import { Typography } from "@/shared/components/typography";

export const SessionActions = () => {
  const { keepAsking, startOver, isPending, canKeepAsking } = useQuizSession();

  return (
    <div className="flex flex-col gap-3">
      {canKeepAsking ? (
        <button
          type="button"
          onClick={keepAsking}
          disabled={isPending}
          className="self-center rounded-lg underline decoration-2 underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-beak disabled:pointer-events-none disabled:opacity-50"
        >
          <Typography as="span" size="sm" weight="bold">
            Not quite? Keep asking
          </Typography>
        </button>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" href="/">
          <HomeIcon />
          Home
        </Button>
        <Button id={sessionReturnFocusId} variant="primary" onClick={startOver}>
          <ReplayIcon />
          Again
        </Button>
      </div>
    </div>
  );
};
