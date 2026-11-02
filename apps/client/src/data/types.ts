export type CategorySlug = "games" | "movies";

export type Category = {
  slug: CategorySlug;
  name: string;
};

export type Tag = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  category: CategorySlug;
  tagId: string;
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

/** Everything a session in one category needs. */
export type SessionData = {
  category: CategorySlug;
  tags: Tag[];
  questions: Question[];
  activities: Activity[];
};
