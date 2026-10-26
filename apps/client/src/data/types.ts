export type CategorySlug = "games" | "movies";

export type Category = {
  slug: CategorySlug;
  name: string;
};

export type Trait = {
  id: string;
  label: string;
};

export type TraitMark = "yes" | "no";

export type Question = {
  id: string;
  category: CategorySlug;
  traitId: string;
  text: string;
};

type ActivityBase = {
  slug: string;
  title: string;
  description: string;
  year: number;
  genres: string[];
  /** Keyed by trait id; a trait missing from the record is unknown. */
  traitMarks: Record<string, TraitMark>;
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
  traits: Trait[];
  questions: Question[];
  activities: Activity[];
};
