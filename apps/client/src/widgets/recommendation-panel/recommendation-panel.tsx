"use client";

import { ActivitySlider } from "@/features/activity-slider";
import { FeedbackComment } from "@/features/feedback-comment";
import { RecommendationIntro } from "@/features/recommendation-intro";
import { SessionActions } from "@/features/session-actions";
import { SingleActivityCard } from "@/features/single-activity-card";
import { useQuizSession } from "@/modules/quiz-session";

export const RecommendationPanel = () => {
  const { step } = useQuizSession();

  if (step.kind !== "recommendation") return null;

  const [featuredActivity] = step.activities;
  const isSingle = step.activities.length === 1 && featuredActivity;

  return (
    <section className="flex flex-1 flex-col gap-6">
      <RecommendationIntro />
      {isSingle ? (
        <SingleActivityCard activity={featuredActivity} />
      ) : (
        <ActivitySlider activities={step.activities} />
      )}
      <SessionActions />
      <FeedbackComment />
    </section>
  );
};
