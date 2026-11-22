export const categorySlugs = ["games", "movies"] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export const isCategorySlug = (slug: string): slug is CategorySlug =>
  categorySlugs.some((known) => known === slug);

export type Category = {
  slug: string;
  name: string;
  activityCount: number;
};

export type Answer = "yes" | "probably" | "dontKnow" | "probablyNot" | "no";

export type GivenAnswer = {
  questionId: string;
  answer: Answer;
};

export type NextStepRequest = {
  answers: GivenAnswer[];
  rejectedAtCount?: number;
};

export type SessionQuestion = {
  id: string;
  text: string;
};

type ActivityBase = {
  slug: string;
  title: string;
  description: string;
  year: number;
  genres: string[];
  /** Ids of the category's tags the activity has; it lacks every other one. */
  tags: string[];
};

export type Game = ActivityBase & {
  category: "games";
  platforms: string[];
  playModes: string[];
};

export type Movie = ActivityBase & {
  category: "movies";
  runtimeMinutes: number;
  director: string;
};

export type Activity = Game | Movie;

export type NextStep =
  | { kind: "question"; question: SessionQuestion; answeredCount: number }
  | { kind: "recommendation"; activities: Activity[] };
