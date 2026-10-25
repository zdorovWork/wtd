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
