"use client";

import { useEffect, useRef } from "react";
import { ActivityLinkList } from "@/features/activity-link-list";
import { SessionActions } from "@/features/session-actions";
import { useQuizSession } from "@/modules/quiz-session";
import { Typography } from "@/shared/components/typography";

export const RecommendationPanel = () => {
  const { step } = useQuizSession();
  const headingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (step.kind !== "recommendation") return null;

  return (
    <section className="mt-10 flex flex-col gap-4">
      <Typography
        as="h1"
        size="2xl"
        weight="semibold"
        font="heading"
        tabIndex={-1}
        ref={headingRef}
      >
        Your recommendation
      </Typography>
      <ActivityLinkList activities={step.activities} />
      <SessionActions />
    </section>
  );
};
