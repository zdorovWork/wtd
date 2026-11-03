"use client";

import { useQuizSession } from "@/modules/quiz-session";
import { ThinkingDuck } from "@/shared/components/detective-duck";
import { SpeechBubble } from "@/shared/components/speech-bubble";
import { Typography } from "@/shared/components/typography";

/** Detective Duck asking the current question. */
export const QuestionPrompt = () => {
  const { step } = useQuizSession();

  if (step.kind !== "question") return null;

  return (
    <section
      aria-live="polite"
      className="mt-10 grid grid-cols-[42%_1fr] items-start gap-3"
    >
      <ThinkingDuck className="mt-10 w-full" />
      <SpeechBubble tail="left" className="min-w-0 pt-7">
        <div className="absolute -top-11 -left-3 grid size-10 place-items-center rounded-xl border-2 border-ink bg-ink">
          <Typography
            as="span"
            size="lg"
            font="heading"
            weight="bold"
            color="duck"
          >
            <Typography as="span" className="sr-only">
              Question{" "}
            </Typography>
            {step.answeredCount + 1}
          </Typography>
        </div>
        <Typography
          as="h1"
          size="xl"
          font="heading"
          weight="semibold"
          className="wrap-break-word"
        >
          {step.question.text}
        </Typography>
      </SpeechBubble>
    </section>
  );
};
