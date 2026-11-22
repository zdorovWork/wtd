export type Category = {
  slug: string;
  name: string;
  activityCount: number;
};

export type Tag = {
  id: string;
  label: string;
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

export type Question = {
  id: string;
  category: "games" | "movies";
  tagId: string;
  text: string;
};
