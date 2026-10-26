"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Activity, SessionData } from "@/data/types";
import {
  type Answer,
  type GivenAnswer,
  getNextStep,
} from "@/engine/recommendation";

type AnswerButton = {
  answer: Answer;
  label: string;
};

const answerButtons: AnswerButton[] = [
  { answer: "yes", label: "Yes" },
  { answer: "probably", label: "Probably" },
  { answer: "dontKnow", label: "Don't know" },
  { answer: "probablyNot", label: "Probably not" },
  { answer: "no", label: "No" },
];

type RecommendationProps = {
  activities: Activity[];
};

const Recommendation = ({ activities }: RecommendationProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold">
        Your recommendation
      </h2>
      <ol className="flex list-decimal flex-col gap-2 pl-6">
        {activities.map((activity) => (
          <li key={activity.slug}>
            <Link
              href={`/${activity.category}/${activity.slug}`}
              className="underline focus-visible:outline-2"
            >
              {activity.title}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

type SessionProps = {
  sessionData: SessionData;
};

export const Session = ({ sessionData }: SessionProps) => {
  const [answers, setAnswers] = useState<GivenAnswer[]>([]);
  const questionHeadingId = useId();
  const step = getNextStep({
    activities: sessionData.activities,
    questions: sessionData.questions,
    answers,
  });

  if (step.kind === "recommendation") {
    return <Recommendation activities={step.activities} />;
  }

  const { question, answeredCount } = step;

  const handleAnswer = (answer: Answer) => {
    setAnswers((current) => [...current, { questionId: question.id, answer }]);
  };

  return (
    <section className="flex flex-col gap-4">
      <div aria-live="polite" className="flex flex-col gap-1">
        <p className="text-sm text-neutral-600">
          Questions answered: {answeredCount}
        </p>
        <h2 id={questionHeadingId} className="text-xl font-semibold">
          {question.text}
        </h2>
      </div>
      <fieldset
        aria-labelledby={questionHeadingId}
        className="flex flex-wrap gap-2"
      >
        {answerButtons.map((answerButton) => (
          <button
            key={answerButton.answer}
            type="button"
            onClick={() => handleAnswer(answerButton.answer)}
            className="rounded border px-4 py-2 hover:bg-neutral-100 focus-visible:outline-2"
          >
            {answerButton.label}
          </button>
        ))}
      </fieldset>
    </section>
  );
};
