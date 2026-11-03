"use client";

import { useEffect, useRef } from "react";
import { useQuizSession } from "@/modules/quiz-session";
import { HappyDuck } from "@/shared/components/detective-duck";
import { SpeechBubble } from "@/shared/components/speech-bubble";
import { Typography } from "@/shared/components/typography";

export const RecommendationIntro = () => {
  const { step } = useQuizSession();
  const headingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (step.kind !== "recommendation") return null;

  const isSingle = step.activities.length === 1;

  return (
    <section className="grid grid-cols-[34%_1fr] items-end gap-3">
      <HappyDuck className="w-full motion-safe:animate-bob" />
      <SpeechBubble tail="left" className="mb-6">
        <Typography
          as="h1"
          size="xl"
          font="heading"
          weight="semibold"
          tabIndex={-1}
          ref={headingRef}
        >
          {isSingle ? "Case closed!" : "I've got my suspects!"}
        </Typography>
        <Typography as="p" size="sm" color="muted" className="mt-1">
          {isSingle
            ? "Elementary. This one fits you best:"
            : `${step.activities.length} activities match your clues. Swipe through them.`}
        </Typography>
      </SpeechBubble>
    </section>
  );
};
