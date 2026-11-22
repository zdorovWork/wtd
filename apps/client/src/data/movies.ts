import { parseMovie } from "./parse-activity.ts";
import { fetchCachedServerApi } from "./server-api.ts";
import type { Movie } from "./types.ts";

export const getMovie = async (slug: string): Promise<Movie | null> => {
  const { status, body } = await fetchCachedServerApi(
    `/api/movies/activities/${encodeURIComponent(slug)}`,
  );
  if (status === 404) return null;
  if (status !== 200) {
    throw new Error(`Failed to load movie: ${status}`);
  }

  return parseMovie(body);
};
