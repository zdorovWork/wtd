"use client";

import { useEffect, useRef } from "react";
import { useQuizSession } from "@/modules/quiz-session";
import { HappyDuck, ThinkingDuck } from "@/shared/components/detective-duck";
import { SpeechBubble } from "@/shared/components/speech-bubble";
import { Typography } from "@/shared/components/typography";

export const RecommendationIntro = () => {
  const { step, isPending } = useQuizSession();
  const headingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (step.kind !== "recommendation") return null;

  const Duck = isPending ? ThinkingDuck : HappyDuck;
  const matchCount = step.activities.length;
  const matchLine =
    matchCount === 1
      ? "1 activity matches your clues."
      : `${matchCount} activities match your clues. Swipe through them.`;

  return (
    <section className="grid grid-cols-[34%_1fr] items-end gap-3">
      <Duck className="w-full motion-safe:animate-bob" />
      <SpeechBubble tail="left" className="mb-6">
        <Typography
          as="h1"
          size="xl"
          font="heading"
          weight="semibold"
          tabIndex={-1}
          ref={headingRef}
        >
          I've got my suspects!
        </Typography>
        <Typography as="p" size="sm" color="muted" className="mt-1">
          {matchLine}
        </Typography>
      </SpeechBubble>
    </section>
  );
};
