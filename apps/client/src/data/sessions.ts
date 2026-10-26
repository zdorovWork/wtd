import { gameQuestions } from "../mocks/game-questions.ts";
import { gameTraits } from "../mocks/game-traits.ts";
import { games } from "../mocks/games.ts";
import { movieQuestions } from "../mocks/movie-questions.ts";
import { movieTraits } from "../mocks/movie-traits.ts";
import { movies } from "../mocks/movies.ts";
import type { CategorySlug, SessionData } from "./types.ts";

const sessionsByCategory: Record<CategorySlug, SessionData> = {
  games: {
    category: "games",
    traits: gameTraits,
    questions: gameQuestions,
    activities: games,
  },
  movies: {
    category: "movies",
    traits: movieTraits,
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
