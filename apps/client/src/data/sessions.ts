import { gameQuestions } from "../mocks/game-questions.ts";
import { gameTags } from "../mocks/game-tags.ts";
import { games } from "../mocks/games.ts";
import { movieQuestions } from "../mocks/movie-questions.ts";
import { movieTags } from "../mocks/movie-tags.ts";
import { movies } from "../mocks/movies.ts";
import type { CategorySlug, SessionData } from "./types.ts";

const sessionsByCategory: Record<CategorySlug, SessionData> = {
  games: {
    category: "games",
    tags: gameTags,
    questions: gameQuestions,
    activities: games,
  },
  movies: {
    category: "movies",
    tags: movieTags,
    questions: movieQuestions,
    activities: movies,
  },
};

const isCategorySlug = (category: string): category is CategorySlug =>
  Object.hasOwn(sessionsByCategory, category);

export const getSessionData = async (
  category: string,
): Promise<SessionData | null> => {
  if (!isCategorySlug(category)) return null;

  return sessionsByCategory[category];
};
