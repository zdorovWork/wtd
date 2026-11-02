import { gameTags } from "../mocks/game-tags.ts";
import { games } from "../mocks/games.ts";
import { findActivityBySlug, listActivitySlugs } from "./activities.ts";
import type { Game, Tag } from "./types.ts";

export const getGame = async (slug: string): Promise<Game | null> =>
  findActivityBySlug(games, slug);

export const listGameSlugs = async (): Promise<string[]> =>
  listActivitySlugs(games);

export const getGameTags = async (): Promise<Tag[]> => gameTags;
