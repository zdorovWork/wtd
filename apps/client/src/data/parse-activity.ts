import type { Game, Movie } from "./types.ts";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isActivityBase = (
  value: object,
): value is {
  slug: unknown;
  title: unknown;
  description: unknown;
  year: unknown;
  genres: unknown;
  tags: unknown;
} =>
  "slug" in value &&
  "title" in value &&
  "description" in value &&
  "year" in value &&
  "genres" in value &&
  "tags" in value;

export const parseGame = (value: unknown): Game => {
  if (
    typeof value !== "object" ||
    value === null ||
    !isActivityBase(value) ||
    !("category" in value) ||
    !("platforms" in value) ||
    !("playModes" in value) ||
    value.category !== "games" ||
    typeof value.slug !== "string" ||
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    typeof value.year !== "number" ||
    !isStringArray(value.genres) ||
    !isStringArray(value.tags) ||
    !isStringArray(value.platforms) ||
    !isStringArray(value.playModes)
  ) {
    throw new Error("Invalid game from the server");
  }

  return {
    category: "games",
    slug: value.slug,
    title: value.title,
    description: value.description,
    year: value.year,
    genres: [...value.genres],
    tags: [...value.tags],
    platforms: [...value.platforms],
    playModes: [...value.playModes],
  };
};

export const parseMovie = (value: unknown): Movie => {
  if (
    typeof value !== "object" ||
    value === null ||
    !isActivityBase(value) ||
    !("category" in value) ||
    !("runtimeMinutes" in value) ||
    !("director" in value) ||
    value.category !== "movies" ||
    typeof value.slug !== "string" ||
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    typeof value.year !== "number" ||
    !isStringArray(value.genres) ||
    !isStringArray(value.tags) ||
    typeof value.runtimeMinutes !== "number" ||
    typeof value.director !== "string"
  ) {
    throw new Error("Invalid movie from the server");
  }

  return {
    category: "movies",
    slug: value.slug,
    title: value.title,
    description: value.description,
    year: value.year,
    genres: [...value.genres],
    tags: [...value.tags],
    runtimeMinutes: value.runtimeMinutes,
    director: value.director,
  };
};

export const parseSlugList = (value: unknown): string[] => {
  if (!isStringArray(value)) {
    throw new Error("Invalid activity slug list from the server");
  }

  return [...value];
};
