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

export type Game = {
  category: "games";
  slug: string;
  title: string;
  description: string;
  year: number;
  genres: string[];
  platforms: string[];
  playModes: string[];
  /** Keyed by trait id; a trait missing from the record is unknown. */
  traitMarks: Record<string, TraitMark>;
};
