import { parseGame } from "./parse-activity.ts";
import { fetchCachedServerApi } from "./server-api.ts";
import type { Game } from "./types.ts";

export const getGame = async (slug: string): Promise<Game | null> => {
  const { status, body } = await fetchCachedServerApi(
    `/api/games/activities/${encodeURIComponent(slug)}`,
  );
  if (status === 404) return null;
  if (status !== 200) {
    throw new Error(`Failed to load game: ${status}`);
  }

  return parseGame(body);
};
