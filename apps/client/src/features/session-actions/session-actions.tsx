"use client";

import { useQuizSession } from "@/modules/quiz-session";
import { Button } from "@/shared/components/button";

export const SessionActions = () => {
  const { keepAsking, startOver } = useQuizSession();

  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" onClick={keepAsking}>
        Keep asking
      </Button>
      <Button variant="secondary" onClick={startOver}>
        Start over
      </Button>
      <Button variant="secondary" href="/">
        Home
      </Button>
    </div>
  );
};
