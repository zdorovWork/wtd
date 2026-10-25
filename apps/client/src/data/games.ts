import { gameTraits } from "../mocks/game-traits.ts";
import { games } from "../mocks/games.ts";
import { findActivityBySlug, listActivitySlugs } from "./activities.ts";
import type { Game, Trait } from "./types.ts";

export const getGame = async (slug: string): Promise<Game | null> =>
  findActivityBySlug(games, slug);

export const listGameSlugs = async (): Promise<string[]> =>
  listActivitySlugs(games);

export const getGameTraits = async (): Promise<Trait[]> => gameTraits;
