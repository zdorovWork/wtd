import { gameQuestions } from "../mocks/game-questions.ts";
import { gameTraits } from "../mocks/game-traits.ts";
import { games } from "../mocks/games.ts";
import type { SessionData } from "./types.ts";

export const getSessionData = async (
  category: string,
): Promise<SessionData | null> => {
  if (category !== "games") return null;

  return {
    category,
    traits: gameTraits,
    questions: gameQuestions,
    activities: games,
  };
};
