"use client";

import { ActivitySlider } from "@/features/activity-slider";
import { BackButton } from "@/features/back-button";
import { FeedbackComment } from "@/features/feedback-comment";
import { RecommendationIntro } from "@/features/recommendation-intro";
import { SessionActions } from "@/features/session-actions";
import { useQuizSession } from "@/modules/quiz-session";

export const RecommendationPanel = () => {
  const { step, isActivityWishStep } = useQuizSession();

  if (step.kind !== "recommendation") return null;

  return (
    <section className="flex flex-1 flex-col gap-6">
      {isActivityWishStep ? (
        <header className="flex items-center">
          <BackButton />
        </header>
      ) : null}
      <RecommendationIntro />
      <ActivitySlider activities={step.activities} />
      <SessionActions />
      <FeedbackComment />
    </section>
  );
};
