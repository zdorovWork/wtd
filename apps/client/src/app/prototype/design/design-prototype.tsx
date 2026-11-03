"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  type PrototypeOption,
  PrototypeSwitcher,
} from "@/components/prototype-switcher";
import type { Category, CategorySlug, SessionData } from "@/data/types";
import { HomeScreen } from "./home-screen";
import { QuestionScreen } from "./question-screen";
import { RecommendationScreen } from "./recommendation-screen";

/*
 * PROTOTYPE: draft mobile design for the home, question, and recommendation
 * screens, switchable via `?screen=` and the floating bottom bar.
 * Lives on the `prototype/mobile-design` branch only; do not merge.
 */

type Screen = "home" | "question" | "single" | "list";

const screenOptions: PrototypeOption[] = [
  { key: "home", label: "Home" },
  { key: "question", label: "Question" },
  { key: "single", label: "Recommendation · one" },
  { key: "list", label: "Recommendation · list" },
];

const QUESTIONS_BEFORE_RECOMMENDATION = 4;
const RECOMMENDATION_SIZE = 5;

const isScreen = (value: string | null): value is Screen =>
  screenOptions.some((option) => option.key === value);

const isCategorySlug = (
  sessions: Record<CategorySlug, SessionData>,
  value: string | null,
): value is CategorySlug => value !== null && Object.hasOwn(sessions, value);

type DesignPrototypeProps = {
  categories: Category[];
  sessions: Record<CategorySlug, SessionData>;
};

export const DesignPrototype = ({
  categories,
  sessions,
}: DesignPrototypeProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [questionIndex, setQuestionIndex] = useState(0);

  const screenParam = searchParams.get("screen");
  const categoryParam = searchParams.get("category");
  const screen: Screen = isScreen(screenParam) ? screenParam : "home";
  const categorySlug: CategorySlug = isCategorySlug(sessions, categoryParam)
    ? categoryParam
    : "games";
  const session = sessions[categorySlug];
  const categoryName =
    categories.find((category) => category.slug === categorySlug)?.name ?? "";

  const navigate = (nextScreen: string, nextCategory = categorySlug) => {
    const params = new URLSearchParams({
      screen: nextScreen,
      category: nextCategory,
    });
    router.replace(`${pathname}?${params}`, { scroll: false });
    window.scrollTo({ top: 0 });
  };

  const handlePickCategory = (category: CategorySlug) => {
    setQuestionIndex(0);
    navigate("question", category);
  };

  const handleAnswer = () => {
    if (questionIndex + 1 >= QUESTIONS_BEFORE_RECOMMENDATION) {
      navigate("list");
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const handleBack = () => {
    if (questionIndex === 0) {
      navigate("home");
      return;
    }
    setQuestionIndex((current) => current - 1);
  };

  const handleHome = () => navigate("home");

  const handlePlayAgain = () => {
    setQuestionIndex(0);
    navigate("question");
  };

  const handleKeepAsking = () => navigate("question");

  const activityCounts: Record<CategorySlug, number> = {
    games: sessions.games.activities.length,
    movies: sessions.movies.activities.length,
  };

  return (
    <div className="flex min-h-dvh justify-center bg-sand font-body text-ink">
      <div className="relative flex min-h-dvh w-full max-w-[430px] flex-col bg-cream shadow-[0_0_0_2px_#2b2b2b]">
        {screen === "home" && (
          <HomeScreen
            categories={categories}
            activityCounts={activityCounts}
            onPickCategory={handlePickCategory}
          />
        )}
        {screen === "question" && (
          <QuestionScreen
            question={
              session.questions[questionIndex % session.questions.length]
            }
            questionNumber={questionIndex + 1}
            categoryName={categoryName}
            onAnswer={handleAnswer}
            onBack={handleBack}
            onHome={handleHome}
          />
        )}
        {screen === "single" && (
          <RecommendationScreen
            activities={session.activities.slice(0, 1)}
            onHome={handleHome}
            onPlayAgain={handlePlayAgain}
            onKeepAsking={handleKeepAsking}
          />
        )}
        {screen === "list" && (
          <RecommendationScreen
            activities={session.activities.slice(0, RECOMMENDATION_SIZE)}
            onHome={handleHome}
            onPlayAgain={handlePlayAgain}
            onKeepAsking={handleKeepAsking}
          />
        )}
      </div>

      {process.env.NODE_ENV !== "production" && (
        <PrototypeSwitcher
          options={screenOptions}
          currentKey={screen}
          onChange={navigate}
        />
      )}
    </div>
  );
};
