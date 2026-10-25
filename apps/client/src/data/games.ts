import { gameTraits } from "../mocks/game-traits.ts";
import { games } from "../mocks/games.ts";
import type { Game, Trait } from "./types.ts";

export const getGame = async (slug: string): Promise<Game | null> =>
  games.find((game) => game.slug === slug) ?? null;

export const listGameSlugs = async (): Promise<string[]> =>
  games.map((game) => game.slug);

export const getGameTraits = async (): Promise<Trait[]> => gameTraits;
